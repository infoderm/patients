import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

import {list} from '@iterable-iterator/list';
import {map} from '@iterable-iterator/map';
import {take} from '@iterable-iterator/slice';
import {filter} from '@iterable-iterator/filter';

import {Consultations} from './consultations.js';
import {Documents} from './documents.js';
import {Attachments} from './attachments.js';

import {insurances} from './insurances.js';
import {doctors} from './doctors.js';
import {allergies} from './allergies.js';

import {makeIndex, shatter, normalized, normalizeSearch} from './string.js';

import observeQuery from './observeQuery.js';
import makeObservedQuery from './makeObservedQuery.js';

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
export const SEX_ALLOWED = [undefined, '', 'male', 'female', 'other'];

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
	if (!SEX_ALLOWED.includes(sex))
		throw new Error(
			`Wrong sex for patient (${sex}). Must be one of ${JSON.stringify(
				SEX_ALLOWED
			)}`
		);
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

		const patient = Patients.findOne({_id: patientId, owner: this.userId});
		if (!patient) {
			throw new Meteor.Error('not-found', 'patient not found');
		}

		const attachment = Attachments.findOne({
			_id: uploadId,
			userId: this.userId
		});
		if (!attachment) {
			throw new Meteor.Error('not-found', 'attachment not found');
		}

		return Attachments.update(uploadId, {
			$addToSet: {'meta.attachedToPatients': patientId}
		});
	},

	'patients.detach'(patientId, uploadId) {
		check(patientId, String);
		check(uploadId, String);

		const patient = Patients.findOne({_id: patientId, owner: this.userId});
		if (!patient) {
			throw new Meteor.Error('not-found', 'patient not found');
		}

		const attachment = Attachments.findOne({
			_id: uploadId,
			userId: this.userId
		});
		if (!attachment) {
			throw new Meteor.Error('not-found', 'attachment not found');
		}

		return Attachments.update(uploadId, {
			$pull: {'meta.attachedToPatients': patientId}
		});
	},

	'patients.remove'(patientId) {
		check(patientId, String);

		const patient = Patients.findOne({_id: patientId, owner: this.userId});
		if (!patient) {
			throw new Meteor.Error('not-found');
		}

		const consultationQuery = {owner: this.userId, patientId};
		const consultationIds = Consultations.find(consultationQuery, {
			fields: {_id: 1}
		})
			.fetch()
			.map((x) => x._id);
		const nConsultationRemoved = Consultations.remove(consultationQuery);

		if (consultationIds.length !== nConsultationRemoved) {
			console.warn(
				`Removed ${nConsultationRemoved} consultations while removing patient #${patientId} but ${
					consultationIds.length
				} where found before (${JSON.stringify(consultationIds)})`
			);
		}

		Documents.update(
			{
				owner: this.userId,
				patientId
			},
			{
				$set: {
					deleted: true
				}
			},
			{
				multi: true
			}
		);

		Attachments.update(
			{
				userId: this.userId,
				'meta.attachedToPatients': patientId
			},
			{
				$pull: {'meta.attachedToPatients': patientId}
			},
			{
				multi: true
			}
		);

		Attachments.update(
			{
				userId: this.userId,
				'meta.attachedToConsultations': {$in: consultationIds}
			},
			{
				$pullAll: {'meta.attachedToConsultations': consultationIds}
			},
			{
				multi: true
			}
		);

		PatientsSearchIndex.remove(patientId);
		return Patients.remove(patientId);
	},

	'patients.merge'(
		oldPatientIds,
		consultationIds,
		attachmentIds,
		documentIds,
		newPatient
	) {
		// Here is what is done in this method
		// (1) Check that user is connected
		// (2) Check that each patient in `oldPatientIds` is owned by the user
		// (3) Create new patient
		// (4) Attach consultations in `consultationIds` to newly created patient
		// (5) Remove consultations that have not been attached
		// (6) Attach attachments in `attachmentIds` to newly created patient
		// (7) Detach old patients from all attachments
		// (8) Attach documents in `documentIds` to newly created patient
		// (9) Remove documents that have not been attached
		// (10) Remove patients in `oldPatientIds`

		// (1)
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		// (2)
		for (const oldPatientId of oldPatientIds) {
			const oldPatient = Patients.findOne({
				_id: oldPatientId,
				owner: this.userId
			});
			if (!oldPatient) {
				throw new Meteor.Error('not-found', 'no such patient');
			}
		}

		// (3)
		const fields = sanitize(newPatient);

		const newPatientId = Patients.insert({
			...fields,
			createdAt: new Date(),
			owner: this.userId
		});

		updateIndex(this.userId, newPatientId, fields);

		// Not needed to update tags since the merged info should only contain
		// existing tags
		// updateTags(this.userId, fields);

		// (4)
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

		// (5)
		Consultations.remove({
			owner: this.userId,
			patientId: {$in: oldPatientIds}
		});

		// (6)
		Attachments.update(
			{
				userId: this.userId, // This selector automatically filters out bad attachments ids
				'meta.attachedToPatients': {$in: oldPatientIds},
				_id: {$in: attachmentIds}
			},
			{
				$addToSet: {'meta.attachedToPatients': newPatientId}
			},
			{
				multi: true
			}
		);

		// (7)
		Attachments.update(
			{
				userId: this.userId,
				'meta.attachedToPatients': {$in: oldPatientIds}
			},
			{
				$pullAll: {'meta.attachedToPatients': oldPatientIds}
			},
			{
				multi: true
			}
		);

		// (8)
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

		// (9)
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

		// (10)
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

		if (oldPatient.noshow) {
			newPatient.noshow += oldPatient.noshow;
		}
	}

	newPatient.allergies = list(new Set(newPatient.allergies));
	newPatient.doctors = list(new Set(newPatient.doctors));
	newPatient.insurances = list(new Set(newPatient.insurances));

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

	const firstname = nameSplit.pop();
	const lastnames = nameSplit;

	return {
		lastname: lastnames.join(' '),
		firstname,
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

export const patients = {
	cacheCollection,
	cachePublication,
	updateIndex,
	insertPatient,
	sanitize,
	toString: patientToString,
	toKey: patientToKey,
	normalizedName,
	merge: mergePatients,
	filter: patientFilter,
	create: createPatient
};
