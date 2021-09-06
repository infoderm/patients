import {Mongo} from 'meteor/mongo';

export interface BookFields {
	name: string;
}

interface BookComputedFields {
	fiscalYear: number | string;
	bookNumber: number | string;
}

interface BookMetadata {
	_id: string;
	owner: string;
}

export type BookDocument = BookFields & BookComputedFields & BookMetadata;

export const collection = 'books';
export const Books = new Mongo.Collection<BookDocument>(collection);
