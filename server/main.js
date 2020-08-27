// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {Meteor} from 'meteor/meteor';
// import {ObjectId} from 'meteor/mongo';

import dateParseISO from 'date-fns/parseISO';

import {Settings} from '../imports/api/settings.js';
import {
	Patients,
	PatientsSearchIndex,
	patients
} from '../imports/api/patients.js';
import {Drugs} from '../imports/api/drugs.js';
import {Consultations} from '../imports/api/consultations.js';
// import {appointments} from '../imports/api/appointments.js';
import {Insurances, insurances} from '../imports/api/insurances.js';
import {Doctors, doctors} from '../imports/api/doctors.js';
import {Allergies, allergies} from '../imports/api/allergies.js';
import {Books, books} from '../imports/api/books.js';
import {Documents, documents} from '../imports/api/documents.js';

Meteor.startup(() => {
	// Code to run on server at startup

	const collections = [
		Settings,
		Patients,
		PatientsSearchIndex,
		Drugs,
		Consultations,
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

	// Reshape doctor, insurance, allergies to arrays
	Patients.rawCollection()
		.find()
		.snapshot()
		.forEach((patient) => {
			if (patient.doctor !== undefined) {
				if (patient.doctor) {
					patient.doctors = [patient.doctor];
				}

				delete patient.doctor;
			}

			if (patient.insurance !== undefined) {
				if (patient.insurance) {
					patient.insurances = [patient.insurance];
				}

				delete patient.insurance;
			}

			if (typeof patient.allergies === 'string') {
				const allergies = patient.allergies
					.split(/[,\n\r]/)
					.map((s) => s.trim())
					.filter((x) => Boolean(x));
				if (allergies.length > 0) {
					patient.allergies = allergies;
				} else {
					delete patient.allergies;
				}
			} else if (!Array.isArray(patient.allergies)) {
				delete patient.allergies;
			}

			Patients.rawCollection().save(patient);
		});

	// Add .isDone field to consultations
	Consultations.rawCollection()
		.find()
		.snapshot()
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

	// Move book/2020/0 consultations of value 20 after march 15 to book/2020/covid
	// and set payment method to third-party
	Consultations.rawCollection()
		.find()
		.snapshot()
		.forEach((consultation) => {
			if (
				consultation.book === '0' &&
				consultation.datetime >= dateParseISO('2020-03-15') &&
				consultation.datetime < dateParseISO('2020-06-01') &&
				consultation.price === 20
			) {
				consultation.book = 'covid';
				consultation.payment_method = 'third-party';
			}

			Consultations.rawCollection().save(consultation);
		});

	// Regenerate PatientsSearchIndex
	PatientsSearchIndex.remove({});
	Patients.rawCollection()
		.find()
		.snapshot()
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
	createSimpleIndex(Patients, 'doctors');
	createSimpleIndex(Patients, 'insurances');
	createSimpleIndex(Patients, 'allergies');
	createSimpleIndex(Documents, 'createdAt');

	Patients.rawCollection().createIndex(
		{
			owner: 1,
			firstname: 'text',
			lastname: 'text'
		},
		{
			background: true,
			weights: {
				firstname: 2,
				lastname: 3
			}
		}
	);

	PatientsSearchIndex.rawCollection().createIndex(
		{
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
		{
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
	);

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
			datetime: 1,
			isDone: 1
		},
		{
			background: true
		}
	);

	Consultations.rawCollection().createIndex(
		{
			owner: 1,
			patientId: 1,
			datetime: 1,
			isDone: 1
		},
		{
			background: true
		}
	);

	Consultations.rawCollection().createIndex(
		{
			owner: 1,
			book: 1,
			datetime: 1,
			isDone: 1
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
			createdAt: 1,
			parsed: 1
		},
		{
			background: true
		}
	);

	Documents.rawCollection().createIndex(
		{
			owner: 1,
			createdAt: 1,
			encoding: 1
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
	const generateTags = (parent, child, key) =>
		parent
			.find()
			.map(
				({owner, [key]: tags}) =>
					tags && tags.forEach((tag) => child.add(owner, tag))
			);

	generateTags(Patients, insurances, 'insurances');
	generateTags(Patients, doctors, 'doctors');
	generateTags(Patients, allergies, 'allergies');

	// eslint-disable-next-line array-callback-return
	Consultations.find().map(({owner, datetime, book, isDone}) => {
		if (isDone && datetime && book) {
			books.add(owner, books.name(datetime, book));
		}
	});

	// Reparse all documents
	Documents.rawCollection()
		.find()
		.snapshot()
		.forEach(
			Meteor.bindEnvironment(
				({_id, owner, createdAt, patientId, format, source, parsed}) => {
					if (!_id.toHexString && parsed) {
						return;
					}

					const array = new TextEncoder().encode(source);

					const document = {
						patientId,
						format,
						array
					};

					const entries = documents.sanitize(document);

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
			)
		);

	// Remove duplicate documents
	const documentsIndex = {};
	Documents.rawCollection()
		.find()
		.snapshot()
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
		.snapshot()
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
		.snapshot()
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
});
