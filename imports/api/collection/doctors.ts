import {Mongo} from 'meteor/mongo';
import TagDocument, {TagNameFields} from '../tags/TagDocument';

export type DoctorDocument = TagDocument;
export type DoctorFields = TagNameFields;

export const collection = 'doctors';
export const Doctors = new Mongo.Collection<DoctorDocument>(collection);
