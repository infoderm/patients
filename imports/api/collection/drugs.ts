import {Mongo} from 'meteor/mongo';

type DrugDocument = {
	_id: string;
	owner: string;
};

export const Drugs = new Mongo.Collection<DrugDocument>('drugs');
