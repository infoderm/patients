import schema from '../../lib/schema';
import {normalizedLineSchema} from '../string';

import define from './define';

export const bookFields = schema.object({
	name: normalizedLineSchema,
});

export type BookFields = schema.infer<typeof bookFields>;

export const bookComputedFields = schema.object({
	fiscalYear: schema.union([schema.number(), schema.string()]),
	bookNumber: schema.union([schema.number(), schema.string()]),
});

export type BookComputedFields = schema.infer<typeof bookComputedFields>;

export const bookMetadata = schema.object({
	_id: schema.string(),
	owner: schema.string(),
});

export type BookMetadata = schema.infer<typeof bookMetadata>;

export const bookDocument = bookFields
	.merge(bookComputedFields)
	.merge(bookMetadata);

export type BookDocument = schema.infer<typeof bookDocument>;

export const collection = 'books';
export const Books = define<BookDocument>(collection);
