import {type TagNameFields} from '../tags/TagDocument';
import type TagDocument from '../tags/TagDocument';

import define from './define';

export type InsuranceDocument = TagDocument;
export type InsuranceFields = TagNameFields;

export const collection = 'insurances';
export const Insurances = define<InsuranceDocument>(collection);

export {tagDocument as insuranceDocument} from '../tags/TagDocument';
