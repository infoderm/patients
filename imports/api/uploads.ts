import fs from 'fs'; // Required to read files initially uploaded via Meteor-Files
import {Meteor} from 'meteor/meteor';
import {FilesCollection} from 'meteor/ostrio:files';

import {all} from '@iterable-iterator/reduce';
import {map} from '@iterable-iterator/map';

import createBucket from '../backend/gridfs/createBucket';
import createObjectId from '../backend/gridfs/createObjectId';

const bucket = Meteor.isServer ? createBucket({bucketName: 'fs'}) : undefined;

const _100MB = 128 * 1024 * 1024;
const MAXIMUM_UPLOAD_SIZE = _100MB; // TODO allow user configuration

export interface MetadataType {
	lastModified?: Date;
	gridFsFileId?: string;
}

export const Uploads = new FilesCollection<MetadataType>({
	collectionName: 'uploads',
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
			this.unlink(this.collection.findOne(upload._id), versionName);
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
	interceptDownload(http, upload, versionName) {
		const {gridFsFileId} = upload.versions[versionName].meta ?? {};
		if (gridFsFileId) {
			const gfsId = createObjectId(gridFsFileId);
			const readStream = bucket.openDownloadStream(gfsId);
			readStream.on('error', (error) => {
				// File not found Error handling without Server Crash
				http.response.statusCode = 404;
				http.response.end('file not found');
				console.error(
					`chunk of file ${upload._id}/${upload.name} was not found`,
				);
				console.debug({error});
			});
			const cacheControl = upload.public
				? this.cacheControl
				: this.cacheControl.replace(/public/, 'private');
			http.response.setHeader('Cache-Control', cacheControl);
			readStream.pipe(http.response);
		}

		return Boolean(gridFsFileId); // Serve file from either GridFS or FS if it wasn't uploaded yet
	},
	onBeforeRemove(cursor) {
		return all(map((x) => x.userId === this.userId, cursor.fetch()));
	},
	onAfterRemove(uploads) {
		uploads.forEach((upload) => {
			Object.keys(upload.versions).forEach((versionName) => {
				const {gridFsFileId} = upload.versions[versionName].meta ?? {};
				if (gridFsFileId) {
					const gfsId = createObjectId(gridFsFileId);
					bucket.delete(gfsId, (error) => {
						if (error) {
							throw error;
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
