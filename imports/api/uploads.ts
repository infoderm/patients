import fs from 'fs'; // Required to read files initially uploaded via Meteor-Files
import {Readable} from 'stream';
import {Meteor} from 'meteor/meteor';
import {FileObj, FilesCollection} from 'meteor/ostrio:files';

import {all} from '@iterable-iterator/reduce';
import {map} from '@iterable-iterator/map';

import createBucket from '../backend/gridfs/createBucket';
import createObjectId from '../backend/gridfs/createObjectId';
import streamToBuffer from '../lib/stream/streamToBuffer';
import {thumbnailStream} from '../lib/pdf/pdfthumbnails';

const bucket = Meteor.isServer ? createBucket({bucketName: 'fs'}) : undefined;

const _100MB = 128 * 1024 * 1024;
const MAXIMUM_UPLOAD_SIZE = _100MB; // TODO allow user configuration

export interface ThumbSizeOptions {
	minWidth?: number;
	minHeight?: number;
}

const imageThumb = async ({minWidth, minHeight}: ThumbSizeOptions) => {
	const {default: sharp} = await import('sharp');
	return sharp().resize({
		width: minWidth,
		height: minHeight,
		fit: 'outside',
		withoutEnlargement: true,
	});
};

const thumbify = async <T>(
	upload: FileObj<T>,
	source: () => Readable,
	size: ThumbSizeOptions,
): Promise<Readable> => {
	if (upload.isImage) {
		// TODO cache
		const resizer = await imageThumb(size);
		return source().pipe(resizer);
	}

	if (upload.isPDF) {
		// TODO cache
		const data = await streamToBuffer(source());
		return thumbnailStream({data}, size, {type: 'image/png'});
	}

	return source();
};

export interface MetadataType {
	createdAt?: Date;
	lastModified?: Date;
	gridFsFileId?: string;
	isDeleted?: boolean;
	attachedToPatients?: string[];
	attachedToConsultations?: string[];
}

const getId = (upload: FileObj<MetadataType>, version: string) => {
	const {gridFsFileId} = upload.versions[version]?.meta ?? {};
	return gridFsFileId ? createObjectId(gridFsFileId) : null;
};

const getReadStreamPromise = async (
	upload: FileObj<MetadataType>,
	version: string,
) => {
	const isThumbnail = /\d+x\d+/.test(version);
	const sourceVersionName = isThumbnail ? 'original' : version;
	const gfsId = getId(upload, sourceVersionName);

	if (gfsId === null) return null;

	return isThumbnail
		? thumbify(upload, () => bucket.openDownloadStream(gfsId), {
				minWidth: Number.parseInt(version.split('x')[0], 10), // TODO do not allow all sizes
				minHeight: Number.parseInt(version.split('x')[1], 10), // TODO do not allow all sizes
		  })
		: Promise.resolve(bucket.openDownloadStream(gfsId));
};

export const Uploads = new FilesCollection<MetadataType>({
	collectionName: 'uploads',
	downloadRoute: '/cdn/storage',
	allowClientCode: true,
	onBeforeUpload(file) {
		console.debug({file});
		if (!this.userId) {
			return 'Must be logged in to upload a file.';
		}

		if (file.size > MAXIMUM_UPLOAD_SIZE) {
			return 'Please upload file with size equal or less than 100MB.';
		}

		return true;
	},
	onAfterUpload(upload) {
		console.debug({upload});
		this.collection.update(upload._id, {
			$set: {
				'meta.createdAt': new Date(),
				'meta.isDeleted': false,
			},
		});

		const unlink = (versionName: string) => {
			// Unlink files from FS
			const document = this.collection.findOne(upload._id);
			if (document !== undefined) {
				this.unlink(document, versionName);
			} else {
				console.error(
					`Could not unlink upload ${upload._id} because it could not be found.`,
				);
			}
		};

		// Move file to GridFS
		Object.keys(upload.versions).forEach((versionName) => {
			const metadata = {
				owner: upload.userId,
				versionName,
				uploadId: upload._id,
				storedAt: new Date(),
			};

			const writeStream = bucket.openUploadStream(upload.name, {
				contentType: upload.type || 'binary/octet-stream',
				metadata,
			});

			const {path} = upload.versions[versionName];
			const readStream = fs.createReadStream(path);

			readStream
				.pipe(writeStream)
				// we unlink the file from the fs on any error
				// that occurred during the upload to prevent zombie files
				.on('error', (err) => {
					console.error(err);
					unlink(versionName);
				})
				// once we are finished, we attach the gridFS Object id on the
				// FilesCollection document's meta section and finally unlink the
				// upload file from the filesystem
				.on(
					'finish',
					Meteor.bindEnvironment((version) => {
						const property = `versions.${versionName}.meta.gridFsFileId`;
						this.collection.update(upload._id, {
							$set: {[property]: version._id.toHexString()},
						});
						unlink(versionName);
					}),
				);
		});
	},
	protected(fileObj) {
		// Check if current user is owner of the file
		return fileObj.userId === this.userId;
	},
	interceptDownload(http, upload, versionName) {
		const getReadStream = getReadStreamPromise(upload, versionName);

		// Serve file from either GridFS or FS if it wasn't uploaded yet
		if (getReadStream === null) return false;

		const onError = (error: unknown) => {
			// File not found Error handling without Server Crash
			http.response.statusCode = 404;
			http.response.end('file not found');
			console.error(`chunk of file ${upload._id}/${upload.name} was not found`);
			console.debug({error});
		};

		getReadStream.then((readStream: Readable) => {
			readStream.on('error', onError);
			const cacheControl = upload.public
				? this.cacheControl
				: this.cacheControl.replace(/public/, 'private');
			http.response.setHeader('Cache-Control', cacheControl);
			readStream.pipe(http.response);
		}, onError);

		return true;
	},
	onBeforeRemove(cursor) {
		return all(map((x) => x.userId === this.userId, cursor.fetch()));
	},
	onAfterRemove(uploads) {
		uploads.forEach((upload) => {
			Object.keys(upload.versions).forEach((versionName) => {
				const gfsId = getId(upload, versionName);
				if (gfsId !== null) {
					bucket.delete(gfsId, (error: unknown) => {
						if (error) {
							if (error instanceof Error) {
								throw error;
							} else {
								console.debug({error});
								throw new Error(
									'Unknown error during bucket.delete in Uploads#onAfterRemove.',
								);
							}
						}
					});
				}
			});
		});
	},
});

if (Meteor.isServer) {
	Uploads.denyClient();
}
