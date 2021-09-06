import {Mongo} from 'meteor/mongo';
import TagDocument, {TagFields} from '../tags/TagDocument';

export type DoctorDocument = TagDocument;
export type DoctorFields = TagFields;

export const collection = 'doctors';
export const Doctors = new Mongo.Collection<DoctorDocument>(collection);
