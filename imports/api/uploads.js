import fs from 'fs'; // Required to read files initially uploaded via Meteor-Files
import {Meteor} from 'meteor/meteor';
import {FilesCollection} from 'meteor/ostrio:files';
import {check} from 'meteor/check';

import {all} from '@iterable-iterator/reduce';
import {map} from '@iterable-iterator/map';

import gridfs from 'gridfs-stream'; // We'll use this package to work with GridFS
import {MongoInternals} from 'meteor/mongo';
import unconditionallyUpdateById from './unconditionallyUpdateById';

// Set up gfs instance
let gfs;
if (Meteor.isServer) {
	gfs = gridfs(
		MongoInternals.defaultRemoteCollectionDriver().mongo.db,
		MongoInternals.NpmModules.mongodb.module
	);
}

export const Uploads = new FilesCollection({
	collectionName: 'uploads',
	allowClientCode: true,
	onBeforeUpload(file) {
		if (!this.userId) {
			return 'Must be logged in to upload a file.';
		}

		if (file.size > 128 * 1024 * 1024) {
			return 'Please upload file with size equal or less than 100MB.';
		}

		return true;
	},
	onAfterUpload(upload) {
		this.collection.update(upload._id, {
			$set: {
				'meta.createdAt': new Date(),
				'meta.isDeleted': false
			}
		});

		// Move file to GridFS
		Object.keys(upload.versions).forEach((versionName) => {
			const metadata = {
				owner: upload.userId,
				versionName,
				uploadId: upload._id,
				storedAt: new Date()
			};
			const writeStream = gfs.createWriteStream({
				filename: upload.name,
				metadata
			});

			fs.createReadStream(upload.versions[versionName].path).pipe(writeStream);

			writeStream.on(
				'close',
				Meteor.bindEnvironment((file) => {
					const property = `versions.${versionName}.meta.gridFsFileId`;

					// Convert ObjectID to String. Because Meteor (EJSON?) seems to convert it to a
					// LocalCollection.ObjectID, which GFS doesn't understand.
					this.collection.update(upload._id, {
						$set: {[property]: file._id.toString()}
					});
					this.unlink(this.collection.findOne(upload._id), versionName); // Unlink file by version from FS
				})
			);
		});
	},
	interceptDownload(http, upload, versionName) {
		const _id = upload.versions[versionName].meta?.gridFsFileId;
		if (_id) {
			const readStream = gfs.createReadStream({_id});
			readStream.on('error', (error) => {
				// File not found Error handling without Server Crash
				http.response.statusCode = 404;
				http.response.end('file not found');
				console.error(
					`chunk of file ${upload._id}/${upload.name} was not found`
				);
				console.debug({error});
			});
			const cacheControl = upload.public
				? this.cacheControl
				: this.cacheControl.replace(/public/, 'private');
			http.response.setHeader('Cache-Control', cacheControl);
			readStream.pipe(http.response);
		}

		return Boolean(_id); // Serve file from either GridFS or FS if it wasn't uploaded yet
	},
	onBeforeRemove(cursor) {
		return all(map((x) => x.userId === this.userId, cursor.fetch()));
	},
	onAfterRemove(uploads) {
		uploads.forEach((upload) => {
			Object.keys(upload.versions).forEach((versionName) => {
				const _id = upload.versions[versionName].meta?.gridFsFileId;
				if (_id) {
					gfs.remove({_id}, (error) => {
						if (error) {
							throw error;
						}
					});
				}
			});
		});
	}
});

if (Meteor.isServer) {
	Uploads.denyClient();
}

Meteor.methods({
	'uploads.updateFilename'(uploadId, filename) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		check(filename, String);
		return Uploads.collection.update(uploadId, {$set: {name: filename}});
	},

	'uploads.delete': unconditionallyUpdateById(
		Uploads.collection,
		{
			$set: {'meta.isDeleted': true}
		},
		'userId'
	),

	'uploads.restore': unconditionallyUpdateById(
		Uploads.collection,
		{
			$set: {'meta.isDeleted': false}
		},
		'userId'
	)
});
