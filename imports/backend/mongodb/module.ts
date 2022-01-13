import {Meteor} from 'meteor/meteor';
import {MongoInternals} from 'meteor/mongo';

export const {ObjectId, GridFSBucket} = Meteor.isServer
	? MongoInternals.NpmModules.mongodb.module
	: ({ObjectId: null, GridFSBucket: null} as any);
