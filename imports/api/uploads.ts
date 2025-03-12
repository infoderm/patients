import fs from 'fs'; // Required to read files initially uploaded via Meteor-Files
import {Readable} from 'stream';

import {Meteor} from 'meteor/meteor';
import {type FileObj, FilesCollection} from 'meteor/ostrio:files';
import {LRUCache as MemoryLRU} from 'lru-cache';

import {all} from '@iterable-iterator/reduce';
import {map} from '@iterable-iterator/map';

import createBucket from '../backend/gridfs/createBucket';
import createObjectId from '../backend/gridfs/createObjectId';
import streamToUint8Array from '../lib/stream/streamToUint8Array';
import {thumbnailStream} from '../lib/pdf/pdfthumbnails';
import schema from '../lib/schema';

import fetchSync from './publication/fetchSync';
import defineCollection from './collection/define';

const bucket = Meteor.isServer ? createBucket({bucketName: 'fs'}) : undefined;

const _1MB = 1024 * 1024;
const _64MB = 64 * _1MB;
const _128MB = 128 * _1MB;
const MAXIMUM_UPLOAD_SIZE = _128MB; // TODO allow user configuration
const THUMBNAIL_CACHE_SIZE = _64MB;

let thumbnailCache: MemoryLRU<string, Uint8Array>;
if (Meteor.isServer) {
	thumbnailCache = new MemoryLRU<string, Uint8Array>({
		max: 1000,
		maxSize: THUMBNAIL_CACHE_SIZE,
		sizeCalculation: (array: Uint8Array) => array.byteLength,
		// NOTE disable ttl
		ttl: 0,
		allowStale: false,
		updateAgeOnGet: false,
	});
}

export type ThumbSizeOptions = {
	minWidth?: number;
	minHeight?: number;
};

const imageThumb = async ({minWidth, minHeight}: ThumbSizeOptions) => {
	const {default: sharp} = await import('sharp');
	return sharp().resize({
		width: minWidth,
		height: minHeight,
		fit: 'outside',
		withoutEnlargement: true,
	});
};

const thumbifyImage = async (
	source: () => Readable,
	size: ThumbSizeOptions,
): Promise<Readable> => {
	const resizer = await imageThumb(size);
	return source().pipe(resizer);
};

const thumbifyPDF = async (
	source: () => Readable,
	size: ThumbSizeOptions,
): Promise<Readable> => {
	// NOTE: https://github.com/mozilla/pdf.js/commit/b6ba8cc84a0cef762aa5349dcb18cc0799f5d946
	const data = await streamToUint8Array(source());
	return thumbnailStream({data}, size, {type: 'image/png'});
};

type StreamTransform = (
	source: () => Readable,
	size: ThumbSizeOptions,
) => Promise<Readable>;

const cacheResult = async <T>(
	upload: FileObj<T>,
	transform: StreamTransform,
	source: () => Readable,
	size: ThumbSizeOptions,
): Promise<Readable> => {
	const key = `${upload._id}-${size.minWidth ?? '?'}x${size.minHeight ?? '?'}`;
	const cached = thumbnailCache.get(key);
	if (cached === undefined) {
		const stream = await transform(source, size);
		const array = await streamToUint8Array(stream);
		thumbnailCache.set(key, array);
		return Readable.from([array]);
	}

	return Readable.from([cached]);
};

const getTransform = <T>(upload: FileObj<T>): StreamTransform | null => {
	if (upload.isImage) return thumbifyImage;
	if (upload.isPDF) return thumbifyPDF;
	return null;
};

const thumbify = async <T>(
	upload: FileObj<T>,
	source: () => Readable,
	size: ThumbSizeOptions,
): Promise<Readable> => {
	const transform = getTransform(upload);
	if (transform === null) return source();
	return cacheResult(upload, transform, source, size);
};

export const meta = schema.object({
	createdAt: schema.date().optional(),
	lastModified: schema.date().optional(),
	gridFsFileId: schema.string().optional(),
	isDeleted: schema.boolean().optional(),
	attachedToPatients: schema.array(schema.string()).optional(),
	attachedToConsultations: schema.array(schema.string()).optional(),
});

export type MetadataType = schema.infer<typeof meta>;

const getId = (upload: FileObj<MetadataType>, version: string) => {
	const {gridFsFileId} = upload.versions[version]?.meta ?? {};
	return gridFsFileId ? createObjectId(gridFsFileId) : null;
};

// NOTE we need this function to be able to return null synchronously

const getReadStreamPromise = (
	upload: FileObj<MetadataType>,
	version: string,
): null | Promise<Readable> => {
	const isThumbnail = /\d+x\d+/.test(version);
	const sourceVersionName = isThumbnail ? 'original' : version;
	const gfsId = getId(upload, sourceVersionName);

	if (gfsId === null) return null;

	return isThumbnail
		? thumbify(upload, () => bucket.openDownloadStream(gfsId), {
				minWidth: Number.parseInt(version.split('x')[0]!, 10), // TODO do not allow all sizes
				minHeight: Number.parseInt(version.split('x')[1]!, 10), // TODO do not allow all sizes
		  })
		: Promise.resolve(bucket.openDownloadStream(gfsId));
};

const _preCollection = defineCollection('__pre_uploads');
const collection = defineCollection<FileObj<MetadataType>>('uploads');
export const Uploads = new FilesCollection<MetadataType>({
	// @ts-expect-error No part of public API.
	_preCollection,
	collection,
	downloadRoute: '/cdn/storage',
	allowClientCode: true,
	onBeforeUpload(file) {
		console.debug({file, chunkId: this.chunkId, eof: this.eof});
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
		const createdAt = new Date();
		// TODO Find a way to set this on insertion. The only reason this code
		// is so complicated is because in tests, things move so fast that we
		// could have marked an upload as deleted before this gets a chance to
		// run.
		this.collection
			.rawCollection()
			.updateOne(
				{_id: upload._id, 'meta.isDeleted': {$exists: false}},
				{
					$set: {
						'meta.createdAt': createdAt,
						'meta.isDeleted': false,
					},
				},
			)
			.then(async (result) => {
				return result.matchedCount === 0
					? this.collection.rawCollection().updateOne(
							{_id: upload._id},
							{
								$set: {
									'meta.createdAt': createdAt,
								},
							},
					  )
					: result;
			})
			.catch((error) => {
				console.error(
					`Failed to initialize metadata for upload ${upload._id}.`,
				);
				console.debug(error);
			});

		const unlink = (versionName: string) => {
			// Unlink files from FS
			this.collection
				.rawCollection()
				.findOne({_id: upload._id})
				.then((document) => {
					if (document === undefined || document === null) {
						throw new Error(
							`Could not unlink upload ${upload._id} because it could not be found.`,
						);
					}

					this.unlink(document, versionName);
				})
				.catch((error) => {
					console.error(
						`Error while unlinking ${versionName} file for ${upload._id} after upload.`,
					);
					console.debug(error);
				});
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

			const {path} = upload.versions[versionName]!;
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
				.on('finish', (version) => {
					const property = `versions.${versionName}.meta.gridFsFileId`;
					const versionId = version._id.toHexString();
					this.collection
						.rawCollection()
						.updateOne(
							{_id: upload._id},
							{
								$set: {[property]: versionId},
							},
						)
						.then((result) => {
							if (result.matchedCount === 0) {
								throw new Error(
									`Could not find upload ${upload._id} to attach version to.`,
								);
							}
						})
						.catch((error) => {
							console.error(
								`Failed to attach version ${versionName} to upload ${upload._id}.`,
							);
							console.debug(error);
						});
					unlink(versionName);
				});
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
		return all(map((x) => x.userId === this.userId, fetchSync(cursor)));
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
