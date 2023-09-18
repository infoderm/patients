import schema from '../../lib/schema';

import {tagDocument} from '../tags/TagDocument';

import define from './define';

export const allergyDocument = tagDocument.merge(
	schema.object({
		color: schema.string().optional(),
	}),
);

export type AllergyDocument = schema.infer<typeof allergyDocument>;

export const collection = 'allergies';
export const Allergies = define<AllergyDocument>(collection);
