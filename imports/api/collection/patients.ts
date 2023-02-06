import {Mongo} from 'meteor/mongo';
import {Match} from 'meteor/check';
import {type FormattedLine, type NormalizedLine} from '../string';

const maybe = Match.Maybe;

export const BIRTHDATE_FORMAT = 'yyyy-MM-dd';
export const SEX_ALLOWED = [undefined, '', 'male', 'female', 'other'];
export type SexAllowed = (typeof SEX_ALLOWED)[number];

export const PatientTagShape = {
	displayName: String,
	name: String,
	comment: maybe(String),
};

export type PatientTag = {
	displayName: FormattedLine;
	name: NormalizedLine;
	comment?: string;
};

export type PatientIdFields = {
	niss: string;
	firstname: string;
	lastname: string;
	birthdate: string;
	sex: SexAllowed;
	photo: string;

	municipality: string;
	streetandnumber: string;
	zip: string;
};

export const PatientEmailShape = {
	address: String,
	local: String,
	domain: String,
	name: maybe(String),
};

export type Email = {
	name?: string;
	address: string;
	local: string;
	domain: string;
};

export type PatientTagFields = {
	allergies: PatientTag[];
	doctors: PatientTag[];
	insurances: PatientTag[];
};

type PatientPersonalInformationFields = {
	deathdateModifiedAt?: Date;
	deathdate?: Date;
	phone: string;

	antecedents: string;
	ongoing: string;
	about: string;

	email?: Email[];

	noshow?: number;
	createdForAppointment?: boolean;
};

export type PatientFields = PatientIdFields &
	PatientPersonalInformationFields &
	PatientTagFields;

export type PatientComputedFields = {
	normalizedName: string;
};

type PatientMetadata = {
	_id: string;
	owner: string;
	createdAt: Date;
};

export type PatientDocument = PatientFields &
	PatientComputedFields &
	PatientMetadata;

const collection = 'patients';
export const Patients = new Mongo.Collection<PatientDocument>(collection);
