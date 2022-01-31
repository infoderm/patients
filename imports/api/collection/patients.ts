import {Mongo} from 'meteor/mongo';

export interface PatientIdFields {
	niss: string;
	firstname: string;
	lastname: string;
	birthdate: string;
	sex: string;
	photo: string;

	municipality: string;
	streetandnumber: string;
	zip: string;
}

export interface PatientFields extends PatientIdFields {
	phone: string;

	antecedents: string;
	ongoing: string;
	about: string;

	allergies: string[];
	doctors: string[];
	insurances: string[];

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
