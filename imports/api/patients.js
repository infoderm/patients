import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

import {list, map, take, filter} from '@aureooms/js-itertools';

import {Consultations} from './consultations.js';
import {Documents} from './documents.js';
import {Uploads} from './uploads.js';

import {insurances} from './insurances.js';
import {doctors} from './doctors.js';
import {allergies} from './allergies.js';

import {makeIndex, shatter, normalized, normalizeSearch} from './string.js';

import observeQuery from './observeQuery.js';
import makeObservedQuery from './makeObservedQuery.js';
import makeCachedFindOne from './makeCachedFindOne.js';

const collection = 'patients';
const cacheCollection = 'patients.find.cache';
const cachePublication = 'patients.find.observe';
const indexCollection = 'patients.index.collection';
const indexCacheCollection = 'patients.index.cache.collection';
const indexCachePublication = 'patients.index.cache.publication';
export const Patients = new Mongo.Collection(collection);
export const PatientsCache = new Mongo.Collection(cacheCollection);
export const PatientsSearchIndex = new Mongo.Collection(indexCollection);
export const PatientsSearchIndexCache = new Mongo.Collection(
	indexCacheCollection
);

export const BIRTHDATE_FORMAT = 'yyyy-MM-dd';
export const SEX_ALLOWED = ['', 'male', 'female', 'other'];

insurances.init(Patients);
doctors.init(Patients);
allergies.init(Patients);

if (Meteor.isServer) {
	Meteor.publish('patients', function (query, options) {
		return Patients.find({...query, owner: this.userId}, options);
	});

	Meteor.publish('patient', function (_id, options) {
		check(_id, String);
		return Patients.find({owner: this.userId, _id}, options);
	});

	Meteor.publish(cachePublication, observeQuery(Patients, cacheCollection));
	Meteor.publish(
		indexCachePublication,
		observeQuery(PatientsSearchIndex, indexCacheCollection)
	);
}

function normalizedName(firstname, lastname) {
	const lastnameHash = normalizeSearch(lastname || '').replace(' ', '-');
	const firstnameHash = normalized(firstname || '').split(' ')[0];
	return `${lastnameHash} ${firstnameHash}`;
}

function updateIndex(userId, _id, fields) {
	const {niss, firstname, lastname, birthdate, sex} = fields;
	const patientIndex = {};
	if (firstname) {
		const nameIndex = shatter(firstname);
		for (const [key, value] of Object.entries(nameIndex)) {
			patientIndex['firstname_' + key] = value;
		}
	}

	if (lastname) {
		const nameIndex = shatter(lastname);
		for (const [key, value] of Object.entries(nameIndex)) {
			patientIndex['lastname_' + key] = value;
		}
	}

	const upsertFields = {
		...patientIndex,
		niss,
		firstname,
		lastname,
		birthdate,
		sex,
		owner: userId
	};

	PatientsSearchIndex.upsert(_id, {
		$set: upsertFields
	});
}

function updateTags(userId, fields) {
	for (const [tagCollection, tagList] of [
		[insurances, fields.insurances],
		[doctors, fields.doctors],
		[allergies, fields.allergies]
	]) {
		if (tagList) {
			for (const tag of tagList) {
				tagCollection.add(userId, tag);
			}
		}
	}
}

function sanitize({
	niss,
	firstname,
	lastname,
	birthdate,
	sex,
	photo,

	antecedents,
	ongoing,
	about,

	municipality,
	streetandnumber,
	zip,
	phone,

	insurances,
	doctors,
	allergies,

	noshow,
	createdForAppointment
}) {
	if (niss !== undefined) check(niss, String);
	if (firstname !== undefined) check(firstname, String);
	if (lastname !== undefined) check(lastname, String);
	if (birthdate !== undefined) check(birthdate, String);
	if (sex !== undefined) check(sex, String);
	if (photo !== undefined) check(photo, String);

	if (antecedents !== undefined) check(antecedents, String);
	if (ongoing !== undefined) check(ongoing, String);
	if (about !== undefined) check(about, String);

	if (municipality !== undefined) check(municipality, String);
	if (streetandnumber !== undefined) check(streetandnumber, String);
	if (zip !== undefined) check(zip, String);
	if (phone !== undefined) check(phone, String);

	if (insurances !== undefined) check(insurances, [String]);
	if (doctors !== undefined) check(doctors, [String]);
	if (allergies !== undefined) check(allergies, [String]);

	if (noshow !== undefined) check(noshow, Number);
	if (createdForAppointment !== undefined)
		check(createdForAppointment, Boolean);

	niss = niss && niss.trim();
	firstname = firstname && firstname.trim();
	lastname = lastname && lastname.trim();
	birthdate = birthdate && birthdate.trim();
	sex = sex && sex.trim();
	photo = photo && photo.replace(/\n/g, '');

	antecedents = antecedents && antecedents.trim();
	ongoing = ongoing && ongoing.trim();
	about = about && about.trim();

	municipality = municipality && municipality.trim();
	streetandnumber = streetandnumber && streetandnumber.trim();
	zip = zip && zip.trim();
	phone = phone && phone.trim();

	if (insurances) {
		insurances = list(map((x) => x.trim(), insurances));
	}

	if (doctors) {
		doctors = list(map((x) => x.trim(), doctors));
	}

	if (allergies) {
		allergies = list(map((x) => x.trim(), allergies));
	}

	return {
		niss,
		firstname,
		lastname,
		birthdate,
		sex,
		photo,
		normalizedName: normalizedName(firstname, lastname),

		antecedents,
		ongoing,
		about,

		municipality,
		streetandnumber,
		zip,
		phone,

		allergies,
		doctors,
		insurances,

		noshow,
		createdForAppointment
	};
}

function insertPatient(patient) {
	if (!this.userId) {
		throw new Meteor.Error('not-authorized');
	}

	const fields = sanitize(patient);

	updateTags(this.userId, fields);

	const patientId = Patients.insert({
		...fields,
		createdAt: new Date(),
		owner: this.userId
	});

	updateIndex(this.userId, patientId, fields);

	return patientId;
}

Meteor.methods({
	'patients.insert': insertPatient,
	'patients.update'(patientId, newfields) {
		check(patientId, String);
		const patient = Patients.findOne(patientId);
		if (patient.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const fields = sanitize(newfields);

		updateTags(this.userId, fields);

		updateIndex(this.userId, patientId, fields);

		return Patients.update(patientId, {$set: fields});
	},

	'patients.attach'(patientId, uploadId) {
		check(patientId, String);
		check(uploadId, String);
		const patient = Patients.findOne(patientId);
		const upload = Uploads.findOne(uploadId);
		if (!patient || patient.owner !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own patient');
		}

		if (!upload || upload.userId !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own attachment');
		}

		// If needed, use $each modifier to attach multiple documents
		// simultaneously.
		// See https://docs.mongodb.com/manual/reference/operator/update/addToSet/#each-modifier
		return Patients.update(patientId, {$addToSet: {attachments: uploadId}});
	},

	'patients.detach'(patientId, uploadId) {
		check(patientId, String);
		check(uploadId, String);
		const patient = Patients.findOne(patientId);
		const upload = Uploads.findOne(uploadId);
		if (!patient || patient.owner !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own patient');
		}

		if (!upload || upload.userId !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own attachment');
		}

		return Patients.update(patientId, {$pull: {attachments: uploadId}});
	},

	'patients.remove'(patientId) {
		check(patientId, String);
		const patient = Patients.findOne(patientId);
		if (patient.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Consultations.remove({owner: this.userId, patientId});
		Documents.update(
			{
				owner: this.userId,
				patientId
			},
			{
				$set: {
					deleted: true
				}
			}
		);
		PatientsSearchIndex.remove(patientId);
		return Patients.remove(patientId);
	},

	'patients.merge'(oldPatientIds, consultationIds, documentIds, newPatient) {
		// Here is what is done in this method
		// (1) Check that user is connected
		// (2) Check that each patient in `oldPatientIds` is owned by the user
		// (3) Check that each attachment in `newPatient.attachments` is attached to a patient in `oldPatientIds`
		// (4) Create new patient with attachments
		// (5) Attach consultations in `consultationIds` to newly created patient
		// (6) Remove consultations that have not been attached
		// (7) Attach documents in `documentIds` to newly created patient
		// (8) Remove documents that have not been attached
		// (9) Remove patients in `oldPatientIds`

		// (1)
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const allowedAttachments = new Set();

		// (2)
		for (const oldPatientId of oldPatientIds) {
			const oldPatient = Patients.findOne(oldPatientId);
			if (!oldPatient || oldPatient.owner !== this.userId) {
				throw new Meteor.Error('not-authorized', 'user does not own patient');
			}

			// Build list of allowed attachments to pass on new patient
			if (oldPatient.attachments) {
				for (const uploadId of oldPatient.attachments) {
					allowedAttachments.add(uploadId);
				}
			}
		}

		// (3) check that all attachments are allowed
		// NOTE could filter and warn instead
		if (newPatient.attachments) {
			for (const uploadId of newPatient.attachments) {
				if (!allowedAttachments.has(uploadId)) {
					throw new Meteor.Error(
						'not-authorized',
						`uploadId ${uploadId} is not allowed in merge`
					);
				}
			}
		}

		// (4)
		const fields = {
			...sanitize(newPatient),
			attachments: newPatient.attachments
		};

		const newPatientId = Patients.insert({
			...fields,
			createdAt: new Date(),
			owner: this.userId
		});

		updateIndex(this.userId, newPatientId, fields);

		// Not needed to update tags since the merged info should only contain
		// existing tags
		// updateTags(this.userId, fields);

		// (5)
		Consultations.update(
			{
				owner: this.userId, // This selector automatically filters out bad consultation ids
				patientId: {$in: oldPatientIds},
				_id: {$in: consultationIds}
			},
			{
				$set: {patientId: newPatientId}
			},
			{
				multi: true
			}
		);

		// (6)
		Consultations.remove({
			owner: this.userId,
			patientId: {$in: oldPatientIds}
		});

		// (7)
		Documents.update(
			{
				owner: this.userId, // This selector automatically filters out bad document ids
				patientId: {$in: oldPatientIds},
				_id: {$in: documentIds}
			},
			{
				$set: {patientId: newPatientId}
			},
			{
				multi: true
			}
		);

		// (8)
		Documents.update(
			{
				owner: this.userId,
				patientId: {$in: oldPatientIds}
			},
			{
				$set: {deleted: true}
			},
			{
				multi: true
			}
		);

		// (9)
		PatientsSearchIndex.remove({
			_id: {$in: oldPatientIds}
		});
		Patients.remove({
			_id: {$in: oldPatientIds}
		});

		return newPatientId;
	},

	'patients.find'(query, options) {
		if (!Meteor.isServer) return undefined;
		return Patients.find({...query, owner: this.userId}, options).fetch();
	}
});

function mergePatients(oldPatients) {
	const newPatient = {
		allergies: [],
		doctors: [],
		insurances: [],
		attachments: [],
		noshow: 0
	};

	for (const oldPatient of oldPatients) {
		const replaceOne = function (key) {
			if (oldPatient[key]) {
				newPatient[key] = oldPatient[key];
			}
		};

		// This data is from the ID card.
		// Currently assuming that merge only needs to happen when
		// someone forgot their ID card the first time.
		// When that is the case, list entry with ID card last in the UI.
		// This is not done automatically for the moment.
		replaceOne('niss');
		replaceOne('firstname');
		replaceOne('lastname');
		replaceOne('birthdate');
		replaceOne('sex');
		replaceOne('photo');
		replaceOne('municipality');
		replaceOne('streetandnumber');
		replaceOne('zip');

		const concatParagraphs = function (x) {
			if (oldPatient[x]) {
				newPatient[x] = newPatient[x]
					? oldPatient[x] + '\n\n' + newPatient[x]
					: oldPatient[x];
			}
		};

		concatParagraphs('antecedents');
		concatParagraphs('ongoing');
		concatParagraphs('about');

		const concatWords = function (x) {
			if (oldPatient[x]) {
				newPatient[x] = newPatient[x]
					? oldPatient[x] + ', ' + newPatient[x]
					: oldPatient[x];
			}
		};

		concatWords('phone');

		const mergeSets = function (x) {
			if (oldPatient[x]) {
				newPatient[x] = oldPatient[x].concat(newPatient[x]);
			}
		};

		mergeSets('allergies');
		mergeSets('doctors');
		mergeSets('insurances');
		mergeSets('attachments');

		if (oldPatient.noshow) {
			newPatient.noshow += oldPatient.noshow;
		}
	}

	newPatient.allergies = list(new Set(newPatient.allergies));
	newPatient.doctors = list(new Set(newPatient.doctors));
	newPatient.insurances = list(new Set(newPatient.insurances));
	newPatient.attachments = list(new Set(newPatient.attachments));

	return newPatient;
}

const patientToKey = (x) => x._id;

const patientToString = (x) => `${x.lastname} ${x.firstname} (${x._id})`;

const patientFilter = (suggestions, inputValue, transform = (v) => v) => {
	const matches = makeIndex(inputValue);

	const keep = 5;

	return list(
		take(
			filter((x) => matches(transform(x)), suggestions),
			keep
		)
	);
};

function createPatient(string) {
	let nameSplit = string.split(',');

	if (nameSplit.length < 2) {
		nameSplit = string.split(' ');
	}

	const [lastname, ...firstnames] = nameSplit;

	return {
		lastname,
		firstname: firstnames.join(' '),
		_id: '?'
	};
}

// TODO rename to useObservedPatients
export const usePatientsFind = makeObservedQuery(
	PatientsCache,
	cachePublication
);

// TODO rename to useAdvancedObservedPatients
export const usePatientsAdvancedFind = makeObservedQuery(
	PatientsSearchIndexCache,
	indexCachePublication
);

export const usePatient = makeCachedFindOne(Patients, 'patient');

export const patients = {
	cacheCollection,
	cachePublication,
	updateIndex,
	insertPatient,
	toString: patientToString,
	toKey: patientToKey,
	normalizedName,
	merge: mergePatients,
	filter: patientFilter,
	create: createPatient
};
