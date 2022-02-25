import {Mongo} from 'meteor/mongo';

import TagDocument, {TagNameFields} from '../tags/TagDocument';

export type InsuranceDocument = TagDocument;
export type InsuranceFields = TagNameFields;

export const collection = 'insurances';
export const Insurances = new Mongo.Collection<InsuranceDocument>(collection);
