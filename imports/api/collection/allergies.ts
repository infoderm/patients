import {Mongo} from 'meteor/mongo';

import TagDocument from '../tags/TagDocument';

export interface AllergyDocument extends TagDocument {
	color?: string;
}

export const collection = 'allergies';
export const Allergies = new Mongo.Collection<AllergyDocument>(collection);
