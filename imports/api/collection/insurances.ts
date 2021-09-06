import {Mongo} from 'meteor/mongo';

import TagDocument, {TagFields} from '../tags/TagDocument';

export type InsuranceDocument = TagDocument;
export type InsuranceFields = TagFields;

export const collection = 'insurances';
export const Insurances = new Mongo.Collection<InsuranceDocument>(collection);
