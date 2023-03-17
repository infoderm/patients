import {patientDocument, Patients} from './collection/patients';
import {consultationDocument, Consultations} from './collection/consultations';
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

export const useConsultationsMissingABook = makeFilteredCollection(
	Consultations,
	consultationDocument,
	{
		isDone: true,
		$or: [{book: null!}, {book: ''}],
	},
	undefined,
	'issues.ConsultationsMissingABook',
);

export const useConsultationsWithPriceZeroNotInBookZero =
	makeFilteredCollection(
		Consultations,
		consultationDocument,
		{
			isDone: true,
			price: 0,
			book: {$ne: '0'},
		},
		undefined,
		'issues.ConsultationsWithPriceZeroNotInBookZero',
	);

export const useConsultationsMissingPaymentData = makeFilteredCollection(
	Consultations,
	consultationDocument,
	{
		isDone: true,
		datetime: {$gte: new Date(2020, 0, 1)},
		$or: [
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
			{price: {$not: {$gt: 1}}},
			{paid: {$not: {$gt: 1}}},
			/**
			 * The original query must then be run on the superset loaded in minimongo.
			 *
			 * Remark:
			 * --
			 * Note that:
			 *   - true >= 1
			 *   - '' >= 0
			 *
			 * So we cannot use price: {$not: {$gte: 0}} which would correspond to
			 * a supserset with negative prices included (and excluding prices in
			 * [0, 1)).
			 */
			{currency: {$not: {$type: 2}}},
			{payment_method: {$not: {$type: 2}}},
		],
	},
	undefined,
	'issues.ConsultationsMissingPaymentData',
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
