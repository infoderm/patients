import {Patients} from './patients.js';
import {Consultations} from './consultations.js';
import {Documents} from './documents.js';
import makeFilteredCollection from './makeFilteredCollection.js';

export const usePatientsMissingABirthdate = makeFilteredCollection(
	Patients,
	{
		$or: [{birthdate: null}, {birthdate: ''}]
	},
	undefined,
	'issues.PatientsMissingABirthdate'
);

export const usePatientsMissingAGender = makeFilteredCollection(
	Patients,
	{
		$or: [{sex: null}, {sex: ''}]
	},
	undefined,
	'issues.PatientsMissingAGender'
);

export const useConsultationsMissingABook = makeFilteredCollection(
	Consultations,
	{
		isDone: true,
		$or: [{book: null}, {book: ''}]
	},
	undefined,
	'issues.ConsultationsMissingABook'
);

export const useConsultationsMissingAPrice = makeFilteredCollection(
	Consultations,
	{
		isDone: true,
		// True > 0
		// '' >= 0
		price: {$not: {$gt: 1}}
	},
	undefined,
	'issues.ConsultationsMissingAPrice'
);

export const useUnlinkedDocuments = makeFilteredCollection(
	Documents,
	{
		patientId: null
	},
	undefined,
	'issues.UnlinkedDocuments'
);

export const useMangledDocuments = makeFilteredCollection(
	Documents,
	{
		encoding: null
	},
	undefined,
	'issues.MangledDocuments'
);

export const useUnparsedDocuments = makeFilteredCollection(
	Documents,
	{
		parsed: false
	},
	undefined,
	'issues.UnparsedDocuments'
);
