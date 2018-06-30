import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';
import { check } from 'meteor/check';

import Grid from 'gridfs-stream'; // We'll use this package to work with GridFS
import fs from 'fs';              // Required to read files initially uploaded via Meteor-Files
import { MongoInternals } from 'meteor/mongo';

// Set up gfs instance
let gfs;
if (Meteor.isServer) {
  gfs = Grid(
    MongoInternals.defaultRemoteCollectionDriver().mongo.db,
    MongoInternals.NpmModule
  );
}

export const Uploads = new FilesCollection({
	collectionName: 'uploads',
	allowClientCode: false,
	onBeforeUpload(file) {
		if (!this.userId) return 'Must be logged in to upload a file.';
		if (file.size > 128 * 1024 * 1024) return 'Please upload file with size equal or less than 100MB.';
		return true;
	},
	onAfterUpload(upload) {
		// Move file to GridFS
		Object.keys(upload.versions).forEach(versionName => {
		  const metadata = {
		    owner: upload.userId,
		    versionName,
		    uploadId: upload._id,
		    storedAt: new Date(),
		  };
		  const writeStream = gfs.createWriteStream({
		    filename: upload.name,
		    metadata,
		  });

		  fs.createReadStream(upload.versions[versionName].path).pipe(writeStream);

		  writeStream.on('close', Meteor.bindEnvironment(file => {
			const property = `versions.${versionName}.meta.gridFsFileId`;

			// Convert ObjectID to String. Because Meteor (EJSON?) seems to convert it to a
			// LocalCollection.ObjectID, which GFS doesn't understand.
			this.collection.update(upload._id, { $set: { [property]: file._id.toString() } });
			this.unlink(this.collection.findOne(upload._id), versionName); // Unlink file by version from FS
		  }));
		});
	},
	interceptDownload(http, upload, versionName) {
		const _id = (upload.versions[versionName].meta || {}).gridFsFileId;
		if (_id) {
		  const readStream = gfs.createReadStream({ _id });
		  readStream.on('error', err => { throw err; });
		  readStream.pipe(http.response);
		}
		return Boolean(_id); // Serve file from either GridFS or FS if it wasn't uploaded yet
	},
	onAfterRemove(uploads) {
		uploads.forEach(upload => {
		  Object.keys(upload.versions).forEach(versionName => {
			const _id = (upload.versions[versionName].meta || {}).gridFsFileId;
			if (_id) gfs.remove({ _id }, err => { if (err) throw err; });
		  });
		});
	},
});

if (Meteor.isServer) {

  Uploads.denyClient();

  Meteor.publish('uploads', function () {
    return Uploads.find({ userId: this.userId }).cursor;
  });

  Meteor.publish('upload', function (_id) {
    check(_id, String);
    return Uploads.find({ userId: this.userId , _id }).cursor;
  });

}
