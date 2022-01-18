import {check} from 'meteor/check';

import {list} from '@iterable-iterator/list';
import {map} from '@iterable-iterator/map';
import {_chain} from '@iterable-iterator/chain';
import {take} from '@iterable-iterator/slice';
import {filter} from '@iterable-iterator/filter';

import {PatientFields, PatientComputedFields} from './collection/patients';

import {PatientsSearchIndex} from './collection/patients/search';

import {insurances} from './insurances';
import {doctors} from './doctors';
import {allergies} from './allergies';

import {
	makeIndex,
	words,
	names,
	keepUnique,
	stringTrigrams,
	boundaryTrigrams,
	junctionTrigrams,
} from './string';
import Wrapper from './transaction/Wrapper';

export const BIRTHDATE_FORMAT = 'yyyy-MM-dd';
export const SEX_ALLOWED = [undefined, '', 'male', 'female', 'other'];

const splitNames = (string: string) => {
	const [firstname, ...middlenames] = names(string);
	const firstnameWords = words(firstname ?? '');
	const middlenameWords = words(middlenames.join(''));
	return [firstnameWords, middlenameWords];
};

function normalizedName(firstname, lastname) {
	const lastnameHash = words(lastname ?? '').join('');
	const firstnameHash = words(names(firstname ?? '')[0] ?? '').join('');
	return `${lastnameHash} ${firstnameHash}`;
}

const updateIndex = async (
	db: Wrapper,
	userId: string,
	_id: string,
	fields,
) => {
	const {niss, firstname, lastname, birthdate, sex} = fields;
	const [firstnameWords, middlenameWords] = splitNames(firstname ?? '');
	const lastnameWords = keepUnique(words(lastname ?? ''));

	const innerTrigrams = keepUnique(
		stringTrigrams(firstnameWords.join('')),
		_chain(map(stringTrigrams, middlenameWords)),
		stringTrigrams(lastname ?? ''),
	);

	const outerTrigrams = keepUnique(
		boundaryTrigrams([...lastnameWords, ...firstnameWords]),
		boundaryTrigrams([...firstnameWords, ...lastnameWords]),
		junctionTrigrams(firstnameWords, middlenameWords),
	);

	const upsertFields = {
		firstnameWords,
		lastnameWords,
		innerTrigrams,
		outerTrigrams,
		niss,
		firstname,
		lastname,
		birthdate,
		sex,
		owner: userId,
	};

	await db.updateOne(
		PatientsSearchIndex,
		{_id},
		{
			$set: upsertFields,
			$currentDate: {lastModifiedAt: true},
		},
		{upsert: true},
	);
};

const updateTags = async (db: Wrapper, userId, fields) => {
	for (const [tagCollection, tagList] of [
		[insurances, fields.insurances],
		[doctors, fields.doctors],
		[allergies, fields.allergies],
	]) {
		if (tagList) {
			for (const tag of tagList) {
				// eslint-disable-next-line no-await-in-loop
				await tagCollection.add(db, userId, tag);
			}
		}
	}
};

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
