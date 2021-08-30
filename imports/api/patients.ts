import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

import {list} from '@iterable-iterator/list';
import {map} from '@iterable-iterator/map';
import {take} from '@iterable-iterator/slice';
import {filter} from '@iterable-iterator/filter';

import {insurances} from './insurances';
import {doctors} from './doctors';
import {allergies} from './allergies';

import {makeIndex, shatter, normalized, normalizeSearch} from './string';

import ObservedQueryCacheCollection from './ObservedQueryCacheCollection';
import makeObservedQueryPublication from './makeObservedQueryPublication';

export interface PatientFields {
	niss: string;
	firstname: string;
	lastname: string;
	birthdate: string;
	sex: string;
	photo: string;

	antecedents: string;
	ongoing: string;
	about: string;

	municipality: string;
	streetandnumber: string;
	zip: string;
	phone: string;

	allergies: string[];
	doctors: string[];
	insurances: string[];

	noshow?: number;
	createdForAppointment?: boolean;
}

interface PatientComputedFields {
	normalizedName: string;
}

interface PatientMetadata {
	_id: string;
	owner: string;
	createdAt: Date;
}

export type PatientDocument = PatientFields &
	PatientComputedFields &
	PatientMetadata;

const collection = 'patients';
const cacheCollection = 'patients.find.cache';
export const cachePublication = 'patients.find.observe';
const indexCollection = 'patients.index.collection';
const indexObservedQueryCacheCollection = 'patients.index.cache.collection';
export const indexCachePublication = 'patients.index.cache.publication';
export const Patients = new Mongo.Collection<PatientDocument>(collection);
export const PatientsCache: ObservedQueryCacheCollection = new Mongo.Collection(
	cacheCollection,
);
export const PatientsSearchIndex = new Mongo.Collection(indexCollection);
export const PatientsSearchIndexCache: ObservedQueryCacheCollection =
	new Mongo.Collection(indexObservedQueryCacheCollection);

export const BIRTHDATE_FORMAT = 'yyyy-MM-dd';
export const SEX_ALLOWED = [undefined, '', 'male', 'female', 'other'];

const {useTaggedDocuments: usePatientsInsuredBy} = insurances.init(Patients);
const {useTaggedDocuments: usePatientsGoingToDoctor} = doctors.init(Patients);
const {useTaggedDocuments: usePatientsHavingAllergy} = allergies.init(Patients);

export {
	usePatientsInsuredBy,
	usePatientsGoingToDoctor,
	usePatientsHavingAllergy,
};

if (Meteor.isServer) {
	Meteor.publish('patients', function (query, options = undefined) {
		return Patients.find({...query, owner: this.userId}, options);
	});

	Meteor.publish('patient', function (_id, options) {
		check(_id, String);
		return Patients.find({owner: this.userId, _id}, options);
	});

	Meteor.publish(
		cachePublication,
		makeObservedQueryPublication(Patients, cacheCollection),
	);
	Meteor.publish(
		indexCachePublication,
		makeObservedQueryPublication(
			PatientsSearchIndex,
			indexObservedQueryCacheCollection,
		),
	);
}

function normalizedName(firstname, lastname) {
	const lastnameHash = normalizeSearch(lastname || '').replace(' ', '-');
	const firstnameHash = normalized(firstname || '').split(' ')[0];
	return `${lastnameHash} ${firstnameHash}`;
}

function updateIndex(userId: string, _id: string, fields) {
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
		owner: userId,
	};

	PatientsSearchIndex.upsert(_id, {
		$set: upsertFields,
		$currentDate: {lastModifiedAt: true},
	});
}

function updateTags(userId, fields) {
	for (const [tagCollection, tagList] of [
		[insurances, fields.insurances],
		[doctors, fields.doctors],
		[allergies, fields.allergies],
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
	createdForAppointment,
}): PatientFields & PatientComputedFields {
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

	niss = niss?.trim();
	firstname = firstname?.trim();
	lastname = lastname?.trim();
	birthdate = birthdate?.trim();
	sex = sex?.trim();
	if (!SEX_ALLOWED.includes(sex))
		throw new Error(
			`Wrong sex for patient (${sex}). Must be one of ${JSON.stringify(
				SEX_ALLOWED,
			)}`,
		);
	photo = photo?.replace(/\n/g, '');

	antecedents = antecedents?.trim();
	ongoing = ongoing?.trim();
	about = about?.trim();

	municipality = municipality?.trim();
	streetandnumber = streetandnumber?.trim();
	zip = zip?.trim();
	phone = phone?.trim();

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
		createdForAppointment,
	};
}

function mergePatients(oldPatients: PatientFields[]): PatientFields {
	const newPatient = {
		allergies: [],
		doctors: [],
		insurances: [],
		noshow: 0,
	};

	for (const oldPatient of oldPatients) {
		const replaceOne = (x: string) => {
			if (oldPatient[x]) {
				newPatient[x] = oldPatient[x];
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

		const concatParagraphs = (x: string) => {
			if (oldPatient[x]) {
				newPatient[x] = newPatient[x]
					? (oldPatient[x] as string) + '\n\n' + (newPatient[x] as string)
					: oldPatient[x];
			}
		};

		concatParagraphs('antecedents');
		concatParagraphs('ongoing');
		concatParagraphs('about');

		const concatWords = (x: string) => {
			if (oldPatient[x]) {
				newPatient[x] = newPatient[x]
					? (oldPatient[x] as string) + ', ' + (newPatient[x] as string)
					: oldPatient[x];
			}
		};

		concatWords('phone');

		const mergeSets = (x: string) => {
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

	return newPatient as PatientFields;
}

const patientToKey = (x) => x._id;

const patientToString = (x) => `${x.lastname} ${x.firstname} (${x._id})`;

const patientFilter = (suggestions, inputValue, transform = (v) => v) => {
	const matches = makeIndex(inputValue);

	const keep = 5;

	return list(
		take(
			filter((x) => matches(transform(x)), suggestions),
			keep,
		),
	);
};

function createPatient(string: string) {
	let nameSplit = string.split(',');

	if (nameSplit.length < 2) {
		nameSplit = string.split(' ');
	}

	const firstname = nameSplit.pop();
	const lastnames = nameSplit;

	return {
		lastname: lastnames.join(' '),
		firstname,
		_id: '?',
	};
}

export const patients = {
	cacheCollection,
	cachePublication,
	updateIndex,
	updateTags,
	sanitize,
	toString: patientToString,
	toKey: patientToKey,
	normalizedName,
	merge: mergePatients,
	filter: patientFilter,
	create: createPatient,
};
