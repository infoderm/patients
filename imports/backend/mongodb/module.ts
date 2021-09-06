import {Meteor} from 'meteor/meteor';
import {MongoInternals} from 'meteor/mongo';

export const {ObjectID, GridFSBucket} = Meteor.isServer
	? MongoInternals.NpmModules.mongodb.module
	: ({} as any);
