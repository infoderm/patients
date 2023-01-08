import {Mongo} from 'meteor/mongo';

import type TagDocument from '../tags/TagDocument';

export type AllergyDocument = {
	color?: string;
} & TagDocument;

export const collection = 'allergies';
export const Allergies = new Mongo.Collection<AllergyDocument>(collection);
