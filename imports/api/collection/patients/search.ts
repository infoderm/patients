import {Mongo} from 'meteor/mongo';

export const indexCollection = 'patients.index.collection';
export const PatientsSearchIndex = new Mongo.Collection(indexCollection);
