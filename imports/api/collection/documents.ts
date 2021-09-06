import {Mongo} from 'meteor/mongo';

export const Documents = new Mongo.Collection<any>('documents');
