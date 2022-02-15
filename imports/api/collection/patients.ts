import {Mongo} from 'meteor/mongo';

export const BIRTHDATE_FORMAT = 'yyyy-MM-dd';
export const SEX_ALLOWED = [undefined, '', 'male', 'female', 'other'];
export type SexAllowed = typeof SEX_ALLOWED[number];

export interface PatientIdFields {
	niss: string;
	firstname: string;
	lastname: string;
	birthdate: string;
	sex: SexAllowed;
	photo: string;

	municipality: string;
	streetandnumber: string;
	zip: string;
}

export interface Email {
	address: string;
	comment?: string;
}

export interface PatientFields extends PatientIdFields {
	deathdateModifiedAt?: Date;
	deathdate?: Date;
	phone: string;

	antecedents: string;
	ongoing: string;
	about: string;

	allergies: string[];
	doctors: string[];
	insurances: string[];

	email?: Email[];

	noshow?: number;
	createdForAppointment?: boolean;
}

export interface PatientComputedFields {
	normalizedName: string;
}

interface PatientMetadata {
	_id: string;
	owner: string;
	createdAt: Date;
}

export type PatientDocument = PatientFields &
	PatientComputedFields &
	PatientMetadata;

const collection = 'patients';
export const Patients = new Mongo.Collection<PatientDocument>(collection);
