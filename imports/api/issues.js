import {Patients} from './patients';
import {Consultations} from './consultations';
import {Documents} from './documents';
import makeFilteredCollection from './makeFilteredCollection';

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
		/**
		 * We filter a superset of the following query:
		 * {
		 *   $or: [{price: {$not: {$type: 1}}}, {price: Number.NaN}]
		 * }.
		 *
		 * Executing this query through meteor raises the following error:
		 * "The Mongo server and the Meteor query disagree on how many documents match your query."
		 * See https://forums.meteor.com/t/the-mongo-server-and-the-meteor-query-disagree-not-type/55086.
		 */
		price: {$not: {$gt: 1}}
		/**
		 * The original query must then be run on the superset loaded in minimongo.
		 *
		 * Remark:
		 * --
		 * Note that:
		 *   - true >= 1
		 *   - '' >= 0
		 *
		 * So we cannot use price: {$not: {$ge: 0}} which would correspond to
		 * a supserset with negative prices included (and excluding prices in
		 * [0, 1)).
		 */
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
