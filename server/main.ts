// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

import addMilliseconds from 'date-fns/addMilliseconds';

import {Settings} from '../imports/api/settings';
import {Patients, PatientsSearchIndex, patients} from '../imports/api/patients';
import {Drugs} from '../imports/api/drugs';
import {Consultations, isUnpaid} from '../imports/api/consultations';
import {Events} from '../imports/api/events';
import {Attachments} from '../imports/api/attachments';
// eslint-disable-next-line import/no-unassigned-import
import '../imports/api/appointments';
import {Insurances, insurances} from '../imports/api/insurances';
import {Doctors, doctors} from '../imports/api/doctors';
import {Allergies, allergies} from '../imports/api/allergies';
import {Books, books} from '../imports/api/books';
import {Documents, documents} from '../imports/api/documents';
// eslint-disable-next-line import/no-unassigned-import
import '../imports/api/issues';
// eslint-disable-next-line import/no-unassigned-import
import '../imports/api/stats';
// eslint-disable-next-line import/no-unassigned-import
import '../imports/api/noShows';

Meteor.startup(() => {
	// Code to run on server at startup

	const collections: Array<Mongo.Collection<any>> = [
		Settings,
		Patients,
		PatientsSearchIndex,
		Drugs,
		Consultations,
		Events,
		Attachments,
		Insurances,
		Doctors,
		Allergies,
		Books,
		Documents
	];

	// Drop all indexes (if the collection is not empty)
	for (const collection of collections) {
		if (collection.find().count() !== 0) {
			collection.rawCollection().dropIndexes();
		}
	}

	// Delete all generated book entries
	Books.remove({});

	// Regenerate patient.normalizedName
	Patients.rawCollection()
		.find()
		.hint({$natural: 1})
		.forEach((patient) => {
			patient.normalizedName = patients.normalizedName(
				patient.firstname,
				patient.lastname
			);
			Patients.rawCollection().save(patient);
		});

	// Change schema for uploads attached to consultations
	Consultations.rawCollection()
		.find()
		.hint({$natural: 1})
		.forEach(
			Meteor.bindEnvironment(({_id, attachments}) => {
				if (attachments) {
					Attachments.update(
						{_id: {$in: attachments}},
						{
							$addToSet: {'meta.attachedToConsultations': _id}
						},
						{multi: true}
					);
					Consultations.update(_id, {$unset: {attachments: true}});
				}
			})
		);

	// Add .isDone field to consultations
	Consultations.rawCollection()
		.find()
		.hint({$natural: 1})
		.forEach((consultation) => {
			if (consultation.scheduledAt) {
				consultation.createdAt = consultation.scheduledAt;
				consultation.datetime = consultation.scheduledDatetime;
				consultation.reason = consultation.scheduledReason;
				delete consultation.scheduledAt;
				delete consultation.scheduledDatetime;
				delete consultation.scheduledReason;
			}

			if (consultation.isDone !== false) {
				consultation.isDone = true;
			}

			Consultations.rawCollection().save(consultation);
		});

	// Add .unpaid field to consultations
	Consultations.rawCollection()
		.find()
		.hint({$natural: 1})
		.forEach((consultation) => {
			if (typeof consultation.unpaid !== 'boolean') {
				consultation.unpaid = isUnpaid(consultation);
			}

			Consultations.rawCollection().save(consultation);
		});

	// Add new appointments/consultations fields
	Consultations.rawCollection()
		.find()
		.hint({$natural: 1})
		.forEach((consultation) => {
			if (consultation.isDone) {
				consultation.realDatetime = consultation.datetime;
			} else {
				consultation.scheduledDatetime = consultation.datetime;
			}

			Consultations.rawCollection().save(consultation);
		});

	// Add begin/end fields
	Consultations.rawCollection()
		.find()
		.hint({$natural: 1})
		.forEach((consultation) => {
			if (consultation.isDone) {
				consultation.begin = consultation.begin ?? consultation.datetime;
				consultation.end =
					consultation.end ??
					consultation.doneDatetime ??
					consultation.datetime;
			} else {
				consultation.begin = consultation.begin ?? consultation.datetime;
				consultation.end =
					consultation.end ??
					addMilliseconds(consultation.datetime, consultation.duration);
			}

			Consultations.rawCollection().save(consultation);
		});

	// Regenerate PatientsSearchIndex
	PatientsSearchIndex.remove({});
	Patients.rawCollection()
		.find()
		.hint({$natural: 1})
		.forEach(
			Meteor.bindEnvironment((patient) => {
				patients.updateIndex(patient.owner, patient._id, patient);
			})
		);

	// Create indexes

	const createSimpleIndex = (collection, field) =>
		collection.rawCollection().createIndex(
			{
				owner: 1,
				[field]: 1
			},
			{
				background: true
			}
		);

	createSimpleIndex(Patients, 'niss');
	createSimpleIndex(Patients, 'lastname');
	createSimpleIndex(Patients, 'normalizedName');
	createSimpleIndex(Patients, 'sex');
	createSimpleIndex(Patients, 'birthdate');
	createSimpleIndex(Patients, 'doctors');
	createSimpleIndex(Patients, 'insurances');
	createSimpleIndex(Patients, 'allergies');
	createSimpleIndex(Documents, 'createdAt');

	createSimpleIndex(Insurances, 'containsNonAlphabetical');
	createSimpleIndex(Doctors, 'containsNonAlphabetical');
	createSimpleIndex(Allergies, 'containsNonAlphabetical');

	Patients.rawCollection().createIndexes([
		{
			key: {
				owner: 1,
				firstname: 'text',
				lastname: 'text'
			},
			background: true,
			weights: {
				firstname: 2,
				lastname: 3
			}
		}
	]);

	PatientsSearchIndex.rawCollection().createIndexes([
		{
			key: {
				owner: 1,
				firstname_whole: 'text',
				firstname_particles: 'text',
				firstname_substring_long: 'text',
				firstname_substring_medium: 'text',
				firstname_substring_short: 'text',
				lastname_whole: 'text',
				lastname_particles: 'text',
				lastname_substring_long: 'text',
				lastname_substring_medium: 'text',
				lastname_substring_short: 'text'
			},
			name: 'PatientsSearchIndex.text',
			default_language: 'none',
			weights: {
				firstname_whole: 15,
				firstname_particles: 4,
				firstname_substring_long: 5,
				firstname_substring_medium: 3,
				firstname_substring_short: 2,
				lastname_whole: 20,
				lastname_particles: 6,
				lastname_substring_long: 7,
				lastname_substring_medium: 5,
				lastname_substring_short: 4
			},
			background: true
		}
	]);

	const createSimpleUniqueIndex = (collection, field) =>
		collection.rawCollection().createIndex(
			{
				owner: 1,
				[field]: 1
			},
			{
				unique: true,
				background: true
			}
		);

	createSimpleUniqueIndex(Settings, 'key');
	createSimpleUniqueIndex(Insurances, 'name');
	createSimpleUniqueIndex(Doctors, 'name');
	createSimpleUniqueIndex(Allergies, 'name');
	createSimpleUniqueIndex(Books, 'name');

	Books.rawCollection().createIndex(
		{
			owner: 1,
			fiscalYear: 1,
			bookNumber: 1
		},
		{
			background: true
		}
	);

	createSimpleUniqueIndex(Drugs, 'mppcv');

	Drugs.rawCollection().createIndex(
		{
			'$**': 'text'
		},
		{
			background: true
		}
	);

	Consultations.rawCollection().createIndex(
		{
			owner: 1,
			datetime: 1
		},
		{
			background: true
		}
	);

	Consultations.rawCollection().createIndex(
		{
			owner: 1,
			begin: 1,
			end: 1
		},
		{
			background: true
		}
	);

	Consultations.rawCollection().createIndex(
		{
			owner: 1,
			end: 1
		},
		{
			background: true
		}
	);

	Consultations.rawCollection().createIndex(
		{
			owner: 1,
			isDone: 1,
			datetime: 1
		},
		{
			background: true
		}
	);

	Consultations.rawCollection().createIndex(
		{
			owner: 1,
			isDone: 1,
			unpaid: 1
		},
		{
			background: true
		}
	);

	Consultations.rawCollection().createIndex(
		{
			owner: 1,
			patientId: 1,
			isDone: 1,
			datetime: -1
		},
		{
			background: true
		}
	);

	Consultations.rawCollection().createIndex(
		{
			owner: 1,
			isDone: 1,
			book: 1,
			datetime: 1
		},
		{
			background: true
		}
	);

	Consultations.rawCollection().createIndex(
		{
			owner: 1,
			isDone: 1,
			payment_method: 1,
			datetime: -1
		},
		{
			background: true
		}
	);

	Consultations.rawCollection().createIndex(
		{
			owner: 1,
			isDone: 1,
			price: 1
		},
		{
			background: true
		}
	);

	Events.rawCollection().createIndex(
		{
			owner: 1,
			begin: 1,
			end: 1
		},
		{
			background: true
		}
	);

	Events.rawCollection().createIndex(
		{
			owner: 1,
			end: 1
		},
		{
			background: true
		}
	);

	Attachments.rawCollection().createIndex(
		{
			userId: 1,
			'meta.attachedToPatients': 1
		},
		{
			background: true
		}
	);

	Attachments.rawCollection().createIndex(
		{
			userId: 1,
			'meta.attachedToConsultations': 1
		},
		{
			background: true
		}
	);

	Documents.rawCollection().createIndex(
		{
			owner: 1,
			patientId: 1,
			datetime: 1,
			status: 1,
			lastVersion: 1,
			deleted: 1
		},
		{
			background: true
		}
	);

	Documents.rawCollection().createIndex(
		{
			owner: 1,
			identifier: 1,
			reference: 1,
			status: 1,
			datetime: -1
		},
		{
			background: true
		}
	);

	Documents.rawCollection().createIndex(
		{
			owner: 1,
			identifier: 1,
			datetime: -1
		},
		{
			background: true
		}
	);

	Documents.rawCollection().createIndex(
		{
			owner: 1,
			patientId: 1,
			createdAt: 1
		},
		{
			background: true
		}
	);

	Documents.rawCollection().createIndex(
		{
			owner: 1,
			parsed: 1,
			createdAt: 1
		},
		{
			background: true
		}
	);

	Documents.rawCollection().createIndex(
		{
			owner: 1,
			encoding: 1,
			createdAt: 1
		},
		{
			background: true
		}
	);

	Documents.rawCollection().createIndex(
		{
			source: 'hashed'
		},
		{
			background: true
		}
	);

	// Recreate all generated entries
	const generateTags = (parent: any, child: any, key: string) =>
		// eslint-disable-next-line array-callback-return
		parent.find().map((item) => {
			const {owner, [key]: tags} = item;
			if (tags) {
				tags.forEach((tag) => child.add(owner, tag));
			}
		});

	generateTags(Patients, insurances, 'insurances');
	generateTags(Patients, doctors, 'doctors');
	generateTags(Patients, allergies, 'allergies');

	// Compute tag fields
	const computeTagFields = (Collection, tags) =>
		Collection.find().map(({owner, name}) => tags.add(owner, name));

	computeTagFields(Insurances, insurances);
	computeTagFields(Doctors, doctors);
	computeTagFields(Allergies, allergies);

	// eslint-disable-next-line array-callback-return
	Consultations.find().map(({owner, datetime, book, isDone}) => {
		if (isDone && datetime && book) {
			books.add(owner, books.name(datetime, book), true);
		}
	});

	// Reparse all documents
	Documents.rawCollection()
		.find()
		.hint({$natural: 1})
		.forEach(
			async ({_id, owner, createdAt, patientId, format, source, parsed}) => {
				if (!_id.toHexString && parsed) {
					return;
				}

				const array = new TextEncoder().encode(source);

				const document = {
					patientId,
					format,
					array
				};

				const entries = await documents.sanitize(document);

				for (const entry of entries) {
					if (!entry.parsed) {
						return;
					}

					const inserted = Documents.insert({
						...entry,
						createdAt,
						owner
					});
					console.debug('Inserted new parsed document', inserted);
				}

				console.debug('Removing old document', _id);
				Documents.rawCollection().remove({_id});
			}
		);

	// Remove duplicate documents
	const documentsIndex = {};
	Documents.rawCollection()
		.find()
		.hint({$natural: 1})
		.forEach(
			Meteor.bindEnvironment(({_id, owner, patientId, source}) => {
				if (documentsIndex[owner] === undefined) {
					documentsIndex[owner] = {};
				}

				const keep = documentsIndex[owner][source];
				if (!keep) {
					documentsIndex[owner][source] = {_id, patientId};
					return;
				}

				if (!keep.patientId) {
					console.debug(
						'Removing previously kept duplicate document',
						keep._id
					);
					Documents.rawCollection().remove({_id: keep._id});
					documentsIndex[owner][source] = {_id, patientId};
				} else {
					console.debug('Removing current duplicate document', _id);
					Documents.rawCollection().remove({_id});
				}
			})
		);

	// Add missing deleted flag
	Documents.rawCollection()
		.find()
		.hint({$natural: 1})
		.forEach(
			Meteor.bindEnvironment(({_id, deleted}) => {
				if (deleted !== true && deleted !== false) {
					Documents.update(_id, {$set: {deleted: false}});
				}
			})
		);

	// Add missing lastVersion flag
	Documents.rawCollection()
		.find()
		.hint({$natural: 1})
		.forEach(
			Meteor.bindEnvironment(
				({owner, parsed, identifier, reference, datetime}) => {
					documents.updateLastVersionFlags(owner, {
						parsed,
						identifier,
						reference,
						datetime
					});
				}
			)
		);

	Promise.all([
		Patients.rawCollection().distinct('_id'),
		Consultations.rawCollection().distinct('_id'),
		Attachments.rawCollection().distinct('meta.attachedToPatients'),
		Attachments.rawCollection().distinct('meta.attachedToConsultations')
	])
		.then(
			Meteor.bindEnvironment(
				([
					patientIds,
					consultationIds,
					attachedToPatientsIds,
					attachedToConsultationsIds
				]) => {
					const patientIdsSet = new Set(patientIds);
					const consultationIdsSet = new Set(consultationIds);
					const badAttachedToPatientsIds = attachedToPatientsIds.filter(
						(x) => !patientIdsSet.has(x)
					);
					const badAttachedToConsultationsIds =
						attachedToConsultationsIds.filter(
							(x) => !consultationIdsSet.has(x)
						);
					if (badAttachedToPatientsIds.length > 0) {
						console.debug(
							'Removing bad patient ids from Attachments.meta.attachedToPatients',
							{badAttachedToPatientsIds}
						);
						Attachments.update(
							{'meta.attachedToPatients': {$in: badAttachedToPatientsIds}},
							{
								$pullAll: {'meta.attachedToPatients': badAttachedToPatientsIds}
							},
							{multi: true}
						);
					}

					if (badAttachedToConsultationsIds.length > 0) {
						console.debug(
							'Removing bad consultation ids from Attachments.meta.attachedToConsultations',
							{badAttachedToConsultationsIds}
						);
						Attachments.update(
							{
								'meta.attachedToConsultations': {
									$in: badAttachedToConsultationsIds
								}
							},
							{
								$pullAll: {
									'meta.attachedToConsultations': badAttachedToConsultationsIds
								}
							},
							{multi: true}
						);
					}
				}
			)
		)
		.catch((error) => {
			console.error(error);
		});
});
