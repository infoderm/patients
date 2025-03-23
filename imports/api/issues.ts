import {
	type PatientDocument,
	patientDocument,
	Patients,
} from './collection/patients';
import {
	type ConsultationDocument,
	consultationDocument,
	Consultations,
} from './collection/consultations';
import {
	type DocumentDocument,
	documentDocument,
	Documents,
} from './collection/documents';
import {
	type AttachmentDocument,
	attachmentDocument,
	Attachments,
} from './collection/attachments';

import makeFilteredCollection from './makeFilteredCollection';
import type Query from './query/Query';

export const usePatientsMissingABirthdate = makeFilteredCollection(
	Patients,
	patientDocument,
	(ctx, {filter: userFilter, ...userOptions}): Query<PatientDocument> => ({
		filter: {
			$or: [{birthdate: null}, {birthdate: ''}],
			...userFilter,
			owner: ctx.userId,
		},
		...userOptions,
	}),
	'issues.PatientsMissingABirthdate',
);

export const usePatientsMissingAGender = makeFilteredCollection(
	Patients,
	patientDocument,
	(ctx, {filter: userFilter, ...userOptions}): Query<PatientDocument> => ({
		filter: {
			$or: [{sex: null}, {sex: ''}],
			...userFilter,
			owner: ctx.userId,
		},
		...userOptions,
	}),
	'issues.PatientsMissingAGender',
);

export const useConsultationsMissingABook = makeFilteredCollection(
	Consultations,
	consultationDocument,
	(ctx, {filter: userFilter, ...userOptions}): Query<ConsultationDocument> => ({
		filter: {
			isDone: true,
			$or: [{book: null}, {book: ''}],
			...userFilter,
			owner: ctx.userId,
		},
		...userOptions,
	}),
	'issues.ConsultationsMissingABook',
);

export const useConsultationsWithPriceZeroNotInBookZero =
	makeFilteredCollection(
		Consultations,
		consultationDocument,
		(
			ctx,
			{filter: userFilter, ...userOptions},
		): Query<ConsultationDocument> => ({
			filter: {
				isDone: true,
				price: 0,
				book: {$ne: '0'},
				...userFilter,
				owner: ctx.userId,
			},
			...userOptions,
		}),
		'issues.ConsultationsWithPriceZeroNotInBookZero',
	);

export const useConsultationsMissingPaymentData = makeFilteredCollection(
	Consultations,
	consultationDocument,
	(ctx, {filter: userFilter, ...userOptions}): Query<ConsultationDocument> => ({
		filter: {
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
			...userFilter,
			owner: ctx.userId,
		},
		...userOptions,
	}),
	'issues.ConsultationsMissingPaymentData',
);

export const useUnlinkedDocuments = makeFilteredCollection(
	Documents,
	documentDocument,
	(ctx, {filter: userFilter, ...userOptions}): Query<DocumentDocument> => ({
		filter: {
			patientId: null,
			...userFilter,
			owner: ctx.userId,
		},
		...userOptions,
	}),
	'issues.UnlinkedDocuments',
);

export const useMangledDocuments = makeFilteredCollection(
	Documents,
	documentDocument,
	(ctx, {filter: userFilter, ...userOptions}): Query<DocumentDocument> => ({
		filter: {
			encoding: null,
			...userFilter,
			owner: ctx.userId,
		},
		...userOptions,
	}),
	'issues.MangledDocuments',
);

export const useUnparsedDocuments = makeFilteredCollection(
	Documents,
	documentDocument,
	(ctx, {filter: userFilter, ...userOptions}): Query<DocumentDocument> => ({
		filter: {
			parsed: false,
			...userFilter,
			owner: ctx.userId,
		},
		...userOptions,
	}),
	'issues.UnparsedDocuments',
);

export const useUnattachedUploads = makeFilteredCollection(
	Attachments,
	attachmentDocument,
	(ctx, {filter: userFilter, ...userOptions}): Query<AttachmentDocument> => ({
		filter: {
			$and: [
				{'meta.attachedToPatients': {$not: {$gt: ''}}},
				{'meta.attachedToConsultations': {$not: {$gt: ''}}},
			],
			...userFilter,
			userId: ctx.userId,
		},
		...userOptions,
	}),
	'issues.UnattachedUploads',
);
