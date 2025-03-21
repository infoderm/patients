import {patientDocument, Patients} from './collection/patients';
import {documentDocument, Documents} from './collection/documents';
import makeFilteredCollection from './makeFilteredCollection';

export const usePatientsMissingABirthdate = makeFilteredCollection(
	Patients,
	patientDocument,
	{
		$or: [{birthdate: null!}, {birthdate: ''}],
	},
	undefined,
	'issues.PatientsMissingABirthdate',
);

export const usePatientsMissingAGender = makeFilteredCollection(
	Patients,
	patientDocument,
	{
		$or: [{sex: null!}, {sex: ''}],
	},
	undefined,
	'issues.PatientsMissingAGender',
);

export const useUnlinkedDocuments = makeFilteredCollection(
	Documents,
	documentDocument,
	{
		patientId: null!,
	},
	undefined,
	'issues.UnlinkedDocuments',
);

export const useMangledDocuments = makeFilteredCollection(
	Documents,
	documentDocument,
	{
		encoding: null!,
	},
	undefined,
	'issues.MangledDocuments',
);

export const useUnparsedDocuments = makeFilteredCollection(
	Documents,
	documentDocument,
	{
		parsed: false,
	},
	undefined,
	'issues.UnparsedDocuments',
);
