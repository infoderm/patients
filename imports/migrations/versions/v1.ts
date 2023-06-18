import assert from 'assert';
import addMilliseconds from 'date-fns/addMilliseconds';

import isValid from 'date-fns/isValid';
import collections from '../../api/collection/all';

import forEachAsync from '../../api/transaction/forEachAsync';
import snapshotTransaction from '../../api/transaction/snapshotTransaction';
import {Settings} from '../../api/collection/settings';
import {Patients} from '../../api/collection/patients';
import {PatientsSearchIndex} from '../../api/collection/patients/search';
import {patients} from '../../api/patients';
import {Drugs} from '../../api/collection/drugs';
import {Consultations} from '../../api/collection/consultations';
import {isUnpaid} from '../../api/consultations';
import {Events} from '../../api/collection/events';
import {Attachments} from '../../api/collection/attachments';
import {Insurances} from '../../api/collection/insurances';
import {insurances} from '../../api/insurances';
import {Doctors} from '../../api/collection/doctors';
import {doctors} from '../../api/doctors';
import {Allergies} from '../../api/collection/allergies';
import {allergies} from '../../api/allergies';
import {Books} from '../../api/collection/books';
import {books} from '../../api/books';
import {Documents} from '../../api/collection/documents';
import {documents} from '../../api/documents';
import {Availability} from '../../api/collection/availability';
import {availability} from '../../api/availability';

import {names} from '../../api/createTagCollection';
import type TagDocument from '../../api/tags/TagDocument';
import db from '../../backend/mongodb/db';

export default async () => {
	// Check that all ids are strings
	await Promise.all(
		collections.map(async (collection) =>
			forEachAsync(
				collection,
				{_id: {$not: {$type: 'string'}}},
				async (_db, {_id}) => {
					if (typeof _id !== 'string') {
						const hex = _id.toHexString();
						throw new Error(
							`Document ${hex} of ${
								collection.rawCollection().collectionName
							} has an _id that is not a string.`,
						);
					}
				},
			),
		),
	);

	const instantiatedCollections = await db().collections();
	const instantiatedCollectionsNames = new Set(
		instantiatedCollections.map((collection) => collection.collectionName),
	);

	// Drop all indexes (if the collection exists)
	await Promise.all(
		collections.map(async (collection) => {
			const rawCollection = collection.rawCollection();
			if (instantiatedCollectionsNames.has(rawCollection.collectionName)) {
				await rawCollection.dropIndexes();
			}
		}),
	);

	// Delete all generated book entries
	await Books.rawCollection().deleteMany({});

	// Delete all generated availability entries
	await Availability.rawCollection().deleteMany({});

	// Regenerate patient.normalizedName
	await forEachAsync(Patients, {}, async (db, patient) => {
		const normalizedName = patients.normalizedName(
			patient.firstname,
			patient.lastname,
		);
		if (normalizedName !== patient.normalizedName) {
			await db.updateOne(
				Patients,
				{_id: patient._id},
				{$set: {normalizedName}},
			);
		}
	});

	// Change schema for patient tags
	const makePatientTagsObjects = async (key: string) =>
		forEachAsync(
			Patients,
			{
				[key]: {$type: 'array', $ne: []},
			},
			async (db, patient) => {
				const tags = patient[key];
				if (typeof tags[0] === 'string') {
					// NOTE we do not normalize because we let the user rename and
					// merge existing tags himself
					const value = tags.map((name: string) => names(name));
					await db.updateOne(
						Patients,
						{_id: patient._id},
						{$set: {[key]: value}},
					);
				}
			},
		);

	await makePatientTagsObjects('allergies');
	await makePatientTagsObjects('doctors');
	await makePatientTagsObjects('insurances');

	// Change schema for uploads attached to consultations
	await forEachAsync(
		Consultations,
		{attachments: {$type: 'array'}},
		async (db, {_id, attachments}) => {
			await db.updateMany(
				Attachments,
				{_id: {$in: attachments}},
				{
					$addToSet: {'meta.attachedToConsultations': _id},
				},
			);
			await db.updateOne(Consultations, {_id}, {$unset: {attachments: true}});
		},
	);

	// Add .unpaid field to consultations
	await forEachAsync(
		Consultations,
		{unpaid: {$nin: [true, false]}},
		async (db, consultation) => {
			const unpaid = isUnpaid(consultation);
			if (unpaid !== consultation.unpaid) {
				await db.updateOne(
					Consultations,
					{_id: consultation._id},
					{$set: {unpaid}},
				);
			}
		},
	);

	await forEachAsync(
		Consultations,
		{isDone: {$nin: [true, false]}},
		async (_db, {_id}) => {
			console.warn(`Consultation ${_id} has incorrect isDone field.`);
		},
	);

	// Update realDatetime for consultations
	await forEachAsync(
		Consultations,
		{isDone: true, $expr: {$ne: ['$realDatetime', '$datetime']}},
		async (db, {_id, isDone, datetime}) => {
			assert(isDone);
			await db.updateOne(
				Consultations,
				{_id},
				{$set: {realDatetime: datetime}},
			);
		},
	);

	// Update scheduledDatetime for appointments
	await forEachAsync(
		Consultations,
		{isDone: false, $expr: {$ne: ['$scheduledDatetime', '$datetime']}},
		async (db, {_id, isDone, datetime}) => {
			assert(!isDone);
			await db.updateOne(
				Consultations,
				{_id},
				{$set: {scheduledDatetime: datetime}},
			);
		},
	);

	// Add begin/end fields
	await forEachAsync(
		Consultations,
		{
			$expr: {
				$or: [{$not: {begin: {$type: 'date'}}}, {$not: {end: {$type: 'date'}}}],
			},
		},
		async (db, consultation) => {
			if (consultation.isDone) {
				const begin = consultation.begin ?? consultation.datetime;
				const end =
					consultation.end ??
					consultation.doneDatetime ??
					consultation.datetime;
				await db.updateOne(
					Consultations,
					{_id: consultation._id},
					{$set: {begin, end}},
				);
			} else {
				const begin = consultation.begin ?? consultation.datetime;
				const end =
					consultation.end ??
					addMilliseconds(consultation.datetime, consultation.duration!);
				await db.updateOne(
					Consultations,
					{_id: consultation._id},
					{$set: {begin, end}},
				);
			}
		},
	);

	// Regenerate PatientsSearchIndex
	await PatientsSearchIndex.rawCollection().deleteMany({});
	await forEachAsync(Patients, {}, async (db, patient) => {
		await patients.updateIndex(db, patient.owner, patient._id, patient);
	});

	// Create indexes

	const createSimpleIndex = (collection, field) =>
		collection.rawCollection().createIndex(
			{
				owner: 1,
				[field]: 1,
			},
			{
				background: true,
			},
		);

	await createSimpleIndex(Patients, 'niss');
	await createSimpleIndex(Patients, 'lastname');
	await createSimpleIndex(Patients, 'normalizedName');
	await createSimpleIndex(Patients, 'sex');
	await createSimpleIndex(Patients, 'birthdate');
	await createSimpleIndex(Patients, 'doctors.name');
	await createSimpleIndex(Patients, 'insurances.name');
	await createSimpleIndex(Patients, 'allergies.name');
	await createSimpleIndex(Documents, 'createdAt');

	await createSimpleIndex(Insurances, 'containsNonAlphabetical');
	await createSimpleIndex(Doctors, 'containsNonAlphabetical');
	await createSimpleIndex(Allergies, 'containsNonAlphabetical');

	await Patients.rawCollection().createIndexes([
		{
			key: {
				owner: 1,
				firstname: 'text',
				lastname: 'text',
			},
			background: true,
			weights: {
				firstname: 2,
				lastname: 3,
			},
		},
	]);

	await PatientsSearchIndex.rawCollection().createIndexes([
		{
			key: {
				owner: 1,
				firstnameWords: 'text',
				lastnameWords: 'text',
				innerTrigrams: 'text',
				outerTrigrams: 'text',
				deathdateModifiedAt: -1,
				lastModifiedAt: -1,
				lastname: 1,
				firstname: 1,
				birthdate: 1,
				sex: 1,
				niss: 1,
			},
			name: 'PatientsSearchIndex.text',
			default_language: 'none',
			weights: {
				firstnameWords: 3,
				lastnameWords: 4,
				innerTrigrams: 8,
				outerTrigrams: 9,
			},
			background: true,
		},
	]);

	const createSimpleUniqueIndex = (collection, field) =>
		collection.rawCollection().createIndex(
			{
				owner: 1,
				[field]: 1,
			},
			{
				unique: true,
				background: true,
			},
		);

	await createSimpleUniqueIndex(Settings, 'key');
	await createSimpleUniqueIndex(Insurances, 'name');
	await createSimpleUniqueIndex(Doctors, 'name');
	await createSimpleUniqueIndex(Allergies, 'name');
	await createSimpleUniqueIndex(Books, 'name');

	await Books.rawCollection().createIndex(
		{
			owner: 1,
			fiscalYear: 1,
			bookNumber: 1,
		},
		{
			background: true,
		},
	);

	await createSimpleUniqueIndex(Drugs, 'mppcv');

	await Drugs.rawCollection().createIndex(
		{
			'$**': 'text',
		},
		{
			background: true,
		},
	);

	await Consultations.rawCollection().createIndex(
		{
			owner: 1,
			datetime: 1,
		},
		{
			background: true,
		},
	);

	await Consultations.rawCollection().createIndex(
		{
			owner: 1,
			begin: 1,
			end: 1,
		},
		{
			background: true,
		},
	);

	await Consultations.rawCollection().createIndex(
		{
			owner: 1,
			end: 1,
		},
		{
			background: true,
		},
	);

	await Consultations.rawCollection().createIndex(
		{
			owner: 1,
			isDone: 1,
			datetime: 1,
		},
		{
			background: true,
		},
	);

	await Consultations.rawCollection().createIndex(
		{
			owner: 1,
			isDone: 1,
			end: 1,
			lastModifiedAt: -1,
		},
		{
			background: true,
		},
	);

	await Consultations.rawCollection().createIndex(
		{
			owner: 1,
			isDone: 1,
			unpaid: 1,
		},
		{
			background: true,
		},
	);

	await Consultations.rawCollection().createIndex(
		{
			owner: 1,
			patientId: 1,
			isDone: 1,
			datetime: -1,
		},
		{
			background: true,
		},
	);

	await Consultations.rawCollection().createIndex(
		{
			owner: 1,
			isDone: 1,
			book: 1,
			datetime: 1,
		},
		{
			background: true,
		},
	);

	await Consultations.rawCollection().createIndex(
		{
			owner: 1,
			isDone: 1,
			payment_method: 1,
			datetime: -1,
		},
		{
			background: true,
		},
	);

	await Consultations.rawCollection().createIndex(
		{
			owner: 1,
			isDone: 1,
			price: 1,
		},
		{
			background: true,
		},
	);

	await Consultations.rawCollection().createIndex(
		{
			owner: 1,
			isDone: 1,
			datetime: -1,
			price: 1,
		},
		{
			background: true,
		},
	);

	await Consultations.rawCollection().createIndex(
		{
			owner: 1,
			isDone: 1,
			datetime: -1,
			paid: 1,
		},
		{
			background: true,
		},
	);

	await Consultations.rawCollection().createIndex(
		{
			owner: 1,
			isDone: 1,
			datetime: -1,
			payment_method: 1,
		},
		{
			background: true,
		},
	);

	await Consultations.rawCollection().createIndex(
		{
			owner: 1,
			isDone: 1,
			datetime: -1,
			currency: 1,
		},
		{
			background: true,
		},
	);

	await Events.rawCollection().createIndex(
		{
			owner: 1,
			begin: 1,
			end: 1,
		},
		{
			background: true,
		},
	);

	await Events.rawCollection().createIndex(
		{
			owner: 1,
			end: 1,
		},
		{
			background: true,
		},
	);

	// NOTE For initial universe insertion (and also some edge case range
	// queries in the case of .end).
	await createSimpleUniqueIndex(Availability, 'begin');
	await createSimpleUniqueIndex(Availability, 'end');

	// NOTE For range queries.
	await Availability.rawCollection().createIndex(
		{
			owner: 1,
			begin: 1,
			end: 1,
		},
		{
			background: true,
		},
	);

	// NOTE For sorted/ranged queries on weight.
	await Availability.rawCollection().createIndex(
		{
			owner: 1,
			weight: 1,
			begin: 1,
			end: 1,
		},
		{
			background: true,
		},
	);

	// NOTE For sorted/ranged queries on weight.
	await Availability.rawCollection().createIndex(
		{
			owner: 1,
			weight: 1,
			end: 1,
		},
		{
			background: true,
		},
	);

	await Attachments.rawCollection().createIndex(
		{
			userId: 1,
			'meta.attachedToPatients': 1,
		},
		{
			background: true,
		},
	);

	await Attachments.rawCollection().createIndex(
		{
			userId: 1,
			'meta.attachedToConsultations': 1,
		},
		{
			background: true,
		},
	);

	await Documents.rawCollection().createIndex(
		{
			owner: 1,
			patientId: 1,
			datetime: 1,
			status: 1,
			lastVersion: 1,
			deleted: 1,
		},
		{
			background: true,
		},
	);

	await Documents.rawCollection().createIndex(
		{
			owner: 1,
			identifier: 1,
			reference: 1,
			status: 1,
			datetime: -1,
		},
		{
			background: true,
		},
	);

	await Documents.rawCollection().createIndex(
		{
			owner: 1,
			identifier: 1,
			datetime: -1,
		},
		{
			background: true,
		},
	);

	await Documents.rawCollection().createIndex(
		{
			owner: 1,
			patientId: 1,
			createdAt: 1,
		},
		{
			background: true,
		},
	);

	await Documents.rawCollection().createIndex(
		{
			owner: 1,
			parsed: 1,
			createdAt: 1,
		},
		{
			background: true,
		},
	);

	await Documents.rawCollection().createIndex(
		{
			owner: 1,
			encoding: 1,
			createdAt: 1,
		},
		{
			background: true,
		},
	);

	await Documents.rawCollection().createIndex(
		{
			source: 'hashed',
		},
		{
			background: true,
		},
	);

	// Add displayName field to tags
	const addDisplayName = async (Collection) =>
		forEachAsync<TagDocument>(
			Collection,
			{displayName: {$exists: false}},
			async (db, {_id, owner, name, ...rest}) => {
				const $set = names(name);
				const match: TagDocument | null = await db.findOne(Collection, {
					_id: {$nin: [_id]},
					owner,
					name: $set.name,
				});
				if (match === null) {
					await db.updateOne(Collection, {_id}, {$set});
				} else {
					await db.deleteOne(Collection, {_id});
					await db.updateOne(Collection, {_id: match._id}, {$set: rest});
				}
			},
		);

	await addDisplayName(Insurances);
	await addDisplayName(Doctors);
	await addDisplayName(Allergies);

	// Recreate all generated entries
	const generateTags = async (parent: any, child: any, key: string) =>
		forEachAsync<any>(
			parent,
			{[key]: {$type: 'array', $ne: []}},
			async (db, item) => {
				const {owner, [key]: tags} = item;
				if (tags) {
					for (const {displayName} of tags) {
						// eslint-disable-next-line no-await-in-loop
						await child.add(db, owner, displayName);
					}
				}
			},
		);

	await generateTags(Patients, insurances, 'insurances');
	await generateTags(Patients, doctors, 'doctors');
	await generateTags(Patients, allergies, 'allergies');

	// Compute tag fields
	const computeTagFields = async (Collection, tags) =>
		forEachAsync<any>(Collection, {}, async (db, {owner, displayName}) => {
			await tags.add(db, owner, displayName);
		});

	await computeTagFields(Insurances, insurances);
	await computeTagFields(Doctors, doctors);
	await computeTagFields(Allergies, allergies);

	await forEachAsync(
		Consultations,
		{isDone: true, datetime: {$type: 'date'}, book: {$exists: true}},
		async (db, {owner, datetime, book}) => {
			if (datetime && book) {
				await books.add(db, owner, books.name(datetime, book), true);
			}
		},
	);

	// Reparse all documents
	await forEachAsync(
		Documents,
		{},
		async (
			db,
			{_id, owner, createdAt, patientId, source, encoding, decoded, parsed},
		) => {
			if (parsed && encoding) {
				// we skip reparsing documents if they are already decoded and
				// parsed
				return;
			}

			const array = new TextEncoder().encode(decoded ?? source);

			const document = {
				patientId,
				array,
			};

			const entries = documents.sanitize(document);

			for await (const entry of entries) {
				if (!entry.parsed) {
					return;
				}

				const {insertedId} = await db.insertOne(Documents, {
					...entry,
					createdAt,
					owner,
				});
				console.debug('Inserted new parsed document', insertedId);
			}

			console.debug('Removing old document', _id);
			await db.deleteOne(Documents, {_id});
		},
	);

	// Remove duplicate documents
	const documentsIndex = {};
	await forEachAsync(
		Documents,
		{},
		async (db, {_id, owner, patientId, source}) => {
			if (documentsIndex[owner] === undefined) {
				documentsIndex[owner] = {};
			}

			const keep = documentsIndex[owner][source];
			if (!keep) {
				documentsIndex[owner][source] = {_id, patientId};
				return;
			}

			if (!keep.patientId) {
				console.debug('Removing previously kept duplicate document', keep._id);
				await db.deleteOne(Documents, {_id: keep._id});
				documentsIndex[owner][source] = {_id, patientId};
			} else {
				console.debug('Removing current duplicate document', _id);
				await db.deleteOne(Documents, {_id});
			}
		},
	);

	// Add missing deleted flag
	await forEachAsync(
		Documents,
		{deleted: {$nin: [true, false]}},
		async (db, {_id}) => {
			await db.updateOne(Documents, {_id}, {$set: {deleted: false}});
		},
	);

	// Add missing lastVersion flag
	await forEachAsync(
		Documents,
		{},
		async (db, {owner, parsed, identifier, reference, datetime}) => {
			await documents.updateLastVersionFlags(db, owner, {
				parsed,
				identifier,
				reference,
				datetime,
			});
		},
	);

	const label = 'remove-bad-attachedTo-ids';
	console.time(label);
	await snapshotTransaction(async (db) => {
		const [
			patientIds,
			consultationIds,
			attachedToPatientsIds,
			attachedToConsultationsIds,
		] = await Promise.all([
			db.distinct(Patients, '_id'),
			db.distinct(Consultations, '_id'),
			db.distinct(Attachments, 'meta.attachedToPatients'),
			db.distinct(Attachments, 'meta.attachedToConsultations'),
		]);

		const patientIdsSet = new Set(patientIds);
		const consultationIdsSet = new Set(consultationIds);
		const badAttachedToPatientsIds = attachedToPatientsIds.filter(
			(x) => !patientIdsSet.has(x),
		);
		const badAttachedToConsultationsIds = attachedToConsultationsIds.filter(
			(x) => !consultationIdsSet.has(x),
		);
		if (badAttachedToPatientsIds.length > 0) {
			console.debug(
				'Removing bad patient ids from Attachments.meta.attachedToPatients',
				{badAttachedToPatientsIds},
			);
			await Attachments.rawCollection().updateMany(
				{'meta.attachedToPatients': {$in: badAttachedToPatientsIds}},
				{
					$pullAll: {'meta.attachedToPatients': badAttachedToPatientsIds},
				},
			);
		}

		if (badAttachedToConsultationsIds.length > 0) {
			console.debug(
				'Removing bad consultation ids from Attachments.meta.attachedToConsultations',
				{badAttachedToConsultationsIds},
			);
			await Attachments.rawCollection().updateMany(
				{
					'meta.attachedToConsultations': {
						$in: badAttachedToConsultationsIds,
					},
				},
				{
					$pullAll: {
						'meta.attachedToConsultations': badAttachedToConsultationsIds,
					},
				},
			);
		}
	});
	console.timeEnd(label);

	// Generate availability data
	await forEachAsync(Consultations, {isDone: false}, async (db, item) => {
		// const {owner, begin, end, isCancelled} = item;
		// await availability.insertHook(db, owner, begin, end, isCancelled ? 0 : 1);
		const {owner, begin, end, isDone, isCancelled} = item;
		await availability.insertHook(
			db,
			owner,
			begin,
			end,
			isDone || isCancelled ? 0 : 1,
		);
	});

	// Add missing lastModifiedAt for all consultations and appointments
	await forEachAsync(
		Consultations,
		{lastModifiedAt: {$not: {$type: 'date'}}},
		async (db, {_id, createdAt, doneDatetime}) => {
			const newLastModifiedAt = !(
				doneDatetime instanceof Date && isValid(doneDatetime)
			)
				? createdAt
				: !(createdAt instanceof Date && isValid(createdAt))
				? doneDatetime
				: createdAt > doneDatetime
				? createdAt
				: doneDatetime;

			if (newLastModifiedAt instanceof Date) {
				await db.updateOne(
					Consultations,
					{_id},
					{
						$set: {lastModifiedAt: newLastModifiedAt},
					},
				);
			}
		},
	);
};
