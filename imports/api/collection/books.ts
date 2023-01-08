import {Mongo} from 'meteor/mongo';

import {type NormalizedLine} from '../string';

export type BookFields = {
	name: NormalizedLine;
};

type BookComputedFields = {
	fiscalYear: number | string;
	bookNumber: number | string;
};

type BookMetadata = {
	_id: string;
	owner: string;
};

export type BookDocument = BookFields & BookComputedFields & BookMetadata;

export const collection = 'books';
export const Books = new Mongo.Collection<BookDocument>(collection);
