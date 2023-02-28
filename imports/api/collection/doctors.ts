import Collection from '../Collection';
import {type TagNameFields} from '../tags/TagDocument';
import type TagDocument from '../tags/TagDocument';

export type DoctorDocument = TagDocument;
export type DoctorFields = TagNameFields;

export const collection = 'doctors';
export const Doctors = new Collection<DoctorDocument>(collection);
