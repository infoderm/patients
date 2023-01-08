import {Mongo} from 'meteor/mongo';

import {type TagNameFields} from '../tags/TagDocument';
import type TagDocument from '../tags/TagDocument';

export type InsuranceDocument = TagDocument;
export type InsuranceFields = TagNameFields;

export const collection = 'insurances';
export const Insurances = new Mongo.Collection<InsuranceDocument>(collection);
