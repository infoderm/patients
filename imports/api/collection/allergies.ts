import schema from '../../lib/schema';
import Collection from '../Collection';

import {tagDocument} from '../tags/TagDocument';

export const allergyDocument = tagDocument.merge(
	schema.object({
		color: schema.string().optional(),
	}),
);

export type AllergyDocument = schema.infer<typeof allergyDocument>;

export const collection = 'allergies';
export const Allergies = new Collection<AllergyDocument>(collection);
