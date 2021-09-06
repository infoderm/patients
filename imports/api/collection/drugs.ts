import {Mongo} from 'meteor/mongo';

interface DrugDocument {
	owner: string;
}

export const Drugs = new Mongo.Collection<DrugDocument>('drugs');
