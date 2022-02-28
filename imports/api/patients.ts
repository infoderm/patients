import {check, Match} from 'meteor/check';

import {list} from '@iterable-iterator/list';
import {map} from '@iterable-iterator/map';
import {_chain} from '@iterable-iterator/chain';
import {take} from '@iterable-iterator/slice';
import {filter} from '@iterable-iterator/filter';

import isValid from 'date-fns/isValid';
import {
	PatientFields,
	PatientComputedFields,
	SEX_ALLOWED,
	PatientEmailShape,
	PatientTagShape,
	PatientTag,
	PatientDocument,
} from './collection/patients';

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

import TransactionDriver from './transaction/TransactionDriver';

import {names as tagNames} from './createTagCollection';
import {
	Entry,
	makeComputedFields,
	makeComputeUpdate,
	makeSanitize,
	yieldKey,
	yieldResettableKey,
} from './update';

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
	db: TransactionDriver,
	userId: string,
	_id: string,
	fields,
) => {
	const {niss, firstname, lastname, birthdate, deathdateModifiedAt, sex} =
		fields;
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
		deathdateModifiedAt,
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

const updateTags = async (
	db: TransactionDriver,
	userId: string,
	fields: PatientFields & PatientComputedFields,
) => {
	for (const {tagCollection, tagList} of [
		{tagCollection: insurances, tagList: fields.insurances},
		{tagCollection: doctors, tagList: fields.doctors},
		{tagCollection: allergies, tagList: fields.allergies},
	]) {
		if (tagList) {
			for (const {displayName} of tagList) {
				// eslint-disable-next-line no-await-in-loop
				await tagCollection.add(db, userId, displayName);
			}
		}
	}
};

const sanitizePatientTag = ({
	name, // We extract the name key
	displayName,
	...rest
}) => ({
	...tagNames(displayName), // We keep key ordering correct
	...rest,
});

const trimString = (value: string | undefined) => value?.trim();
const sanitizePatientTags = (tags) => list(map(sanitizePatientTag, tags));
const where = Match.Where;

const sanitizeUpdate = function* (
	fields: Partial<PatientFields>,
): IterableIterator<Entry<PatientFields & PatientComputedFields>> {
	yield* yieldKey(fields, 'niss', String, trimString);
	yield* yieldKey(fields, 'firstname', String, trimString);
	yield* yieldKey(fields, 'lastname', String, trimString);
	yield* yieldKey(fields, 'birthdate', String, trimString);
	yield* yieldKey(
		fields,
		'sex',
		where((sex) => {
			if (!SEX_ALLOWED.includes(sex))
				throw new Error(
					`Wrong sex for patient (${sex}). Must be one of ${JSON.stringify(
						SEX_ALLOWED,
					)}`,
				);
			return true;
		}),
	);
	yield* yieldKey(fields, 'photo', String, (photo) =>
		photo?.replace(/\n/g, ''),
	);

	yield* yieldResettableKey(
		fields,
		'deathdateModifiedAt',
		where((deathdateModifiedAt) => {
			if (deathdateModifiedAt !== null) {
				check(deathdateModifiedAt, Date);
				if (!isValid(deathdateModifiedAt)) {
					throw new Error('Invalid date given for field `deathdateModifiedAt`');
				}
			}

			return true;
		}),
		(deathdateModifiedAt: Date | null) => deathdateModifiedAt ?? undefined,
	);

	yield* yieldResettableKey(
		fields,
		'deathdate',
		where((deathdate) => {
			if (deathdate !== null) {
				check(deathdate, Date);
				if (!isValid(deathdate)) {
					throw new Error('Invalid date given for field `deathdate`');
				}
			}

			return true;
		}),
		(deathdate: Date | null) => deathdate ?? undefined,
	);

	yield* yieldKey(fields, 'antecedents', String, trimString);
	yield* yieldKey(fields, 'ongoing', String, trimString);
	yield* yieldKey(fields, 'about', String, trimString);

	yield* yieldKey(fields, 'municipality', String, trimString);
	yield* yieldKey(fields, 'streetandnumber', String, trimString);
	yield* yieldKey(fields, 'zip', String, trimString);
	yield* yieldKey(fields, 'phone', String, trimString);
	yield* yieldKey(fields, 'email', [PatientEmailShape]);

	yield* yieldKey(fields, 'insurances', [PatientTagShape], sanitizePatientTags);
	yield* yieldKey(fields, 'doctors', [PatientTagShape], sanitizePatientTags);
	yield* yieldKey(fields, 'allergies', [PatientTagShape], sanitizePatientTags);

	yield* yieldKey(fields, 'noshow', Match.Integer);
	yield* yieldKey(fields, 'createdForAppointment', Boolean);
};

const sanitize = makeSanitize(sanitizeUpdate);

const computedFieldsGenerator = async function* (
	_db: TransactionDriver,
	_owner: string,
	state: Partial<PatientDocument>,
): AsyncIterableIterator<Entry<PatientDocument>> {
	const {firstname, lastname} = state;
	yield ['normalizedName', normalizedName(firstname, lastname)];
};

const computedFields = makeComputedFields(computedFieldsGenerator);

export const computeUpdate = makeComputeUpdate(computedFields);

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

	const mergeTags = <T extends PatientTag>(tags: T[]) => {
		const result = new Map<string, T>();
		for (const tag of tags) {
			if (result.has(tag.name)) {
				if (tag.comment) {
					const newTag = result.get(tag.name);
					if (newTag.comment === undefined) {
						newTag.comment = tag.comment;
					} else {
						newTag.comment += ', ';
						newTag.comment += tag.comment;
					}
				}
			} else {
				result.set(tag.name, {...tag});
			}
		}

		return list(result.values());
	};

	newPatient.allergies = mergeTags(newPatient.allergies);
	newPatient.doctors = mergeTags(newPatient.doctors);
	newPatient.insurances = mergeTags(newPatient.insurances);

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
