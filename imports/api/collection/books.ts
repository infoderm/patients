import {Mongo} from 'meteor/mongo';

import {NormalizedLine} from '../string';

export interface BookFields {
	name: NormalizedLine;
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
