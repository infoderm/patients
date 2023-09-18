import {type TagNameFields} from '../tags/TagDocument';
import type TagDocument from '../tags/TagDocument';

import define from './define';

export type DoctorDocument = TagDocument;
export type DoctorFields = TagNameFields;

export const collection = 'doctors';
export const Doctors = define<DoctorDocument>(collection);

export {tagDocument as doctorDocument} from '../tags/TagDocument';
