import Collection from '../Collection';

import type TagDocument from '../tags/TagDocument';

export type AllergyDocument = {
	color?: string;
} & TagDocument;

export const collection = 'allergies';
export const Allergies = new Collection<AllergyDocument>(collection);
