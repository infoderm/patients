import {Buffer} from 'buffer';

import {Meteor} from 'meteor/meteor';
// Import { Binary } from 'meteor/mongo';
import {check} from 'meteor/check';

import omit from 'lodash.omit';

import {zip} from '@iterable-iterator/zip';

import {Patients} from './collection/patients';
import {patients} from './patients';

import {Documents} from './collection/documents';

// Const utfLabelToEncoding = {
// 'iso-8859-1': 'windows-1252',
// } ;

async function sanitize({patientId, format, array}) {
	if (patientId !== undefined) check(patientId, String);
	check(format, String);
	check(array, Uint8Array);

	console.debug('Starting to sanitize');

	const mangled = new TextDecoder('utf-8', {fatal: false}).decode(
		array.buffer,
		{stream: false},
	);

	try {
		console.debug('trying to detect encoding...');
		// Const utfLabel = chardet.detect(array).toLowerCase();
		// const encoding = utfLabelToEncoding[utfLabel] || utfLabel;
		const chardet = await import('chardet');
		const encoding = chardet.detect(array).toLowerCase();
		console.debug('encoding', encoding);
		// Console.debug('constructing decoder');
		// const decoder = new TextDecoder(encoding, {fatal: true});
		// console.debug('trying to decode with', decoder, '...');
		// const decoded = decoder.decode(array.buffer, {stream: false});
		console.debug('trying to decode with iconv...');

		const iconv = await import('iconv-lite');
		// `as Buffer` below is a temporary type hack.
		// Waiting for https://github.com/ashtuchkin/iconv-lite/issues/235.
		const decoded = iconv.decode(array as Buffer, encoding);
		console.debug('worked!');

		if (format === 'healthone') {
			const {default: parseHealthOne} = await import(
				'healthone/dist/default/parse.js'
			);
			try {
				const entries = [];
				const mangledDocuments = parseHealthOne(mangled);
				const documents = parseHealthOne(decoded);
				if (mangledDocuments.length !== documents.length) {
					throw new Error('Number of entries do not match.');
				}

				for (const [document, mangledDocument] of zip(
					documents,
					mangledDocuments,
				)) {
					// Const utf8_array = (new TextEncoder()).encode(decoded);
					// const utf8_buffer = utf8_array.buffer;
					// const utf8_binary = Binary(utf8_buffer);
					const entry = {
						...omit(document, ['lines']),
						patientId,
						format,
						source: mangledDocument.lines.join('\n'),
						encoding,
						decoded: document.lines.join('\n'),
						// Binary: utf8_binary,
						parsed: true,
					};
					entries.push(entry);
				}

				return entries;
			} catch (error: unknown) {
				console.error('Failed to parse Health One document.', error);
			}
		}

		return [
			{
				patientId,
				format,
				parsed: false,
				source: mangled,
				// Binary: Binary(buffer),
				encoding,
				decoded,
				lastVersion: true,
			},
		];
	} catch (error: unknown) {
		console.error('Failed to decode document buffer', error);
	}

	return [
		{
			patientId,
			format,
			source: mangled,
			parsed: false,
			lastVersion: true,
			// Binary: Binary(buffer),
		},
	];
}

function* findBestPatientMatch_queries(entry) {
	if (entry.patient) {
		const {nn, firstname, lastname} = entry.patient;

		if (nn) yield {niss: nn};

		if (firstname && lastname) {
			yield {normalizedName: patients.normalizedName(firstname, lastname)};
			// In case names have been swapped
			yield {normalizedName: patients.normalizedName(lastname, firstname)};
		}
	}
}

function findBestPatientMatch(owner, entry) {
	if (entry.patientId) {
		return entry.patientId;
	}

	const firstTwo = {limit: 2};

	const queries = findBestPatientMatch_queries(entry);

	for (const query of queries) {
		const matches = Patients.find({...query, owner}, firstTwo).fetch();
		switch (matches.length) {
			case 0:
				// If no patient matches
				continue;
			case 1:
				// If exactly 1 patient matches
				return matches[0]._id;
			default:
				// If more than 1 patient matches
				return undefined;
		}
	}

	return undefined;
}

export function findBestPatientMatchServerOnly(owner, entry) {
	// This query depends on the entire database being available.
	// Therefore, it cannot be simulated efficiently on the client.
	if (Meteor.isServer) return findBestPatientMatch(owner, entry);
	return undefined;
}

function updateLastVersionFlags(owner, document) {
	if (!document.parsed) {
		return;
	}

	const {identifier, reference} = document;

	const latest = Documents.findOne(
		{
			owner,
			identifier,
			reference,
			deleted: false,
		},
		{
			sort: {
				status: 1, // Complete < partial
				datetime: -1,
			},
		},
	);

	if (latest === undefined) {
		return;
	}

	Documents.update(latest._id, {$set: {lastVersion: true}});

	Documents.update(
		{
			owner,
			identifier,
			reference,
			lastVersion: true,
			_id: {$ne: latest._id},
		},
		{
			$set: {
				lastVersion: false,
			},
		},
		{
			multi: true,
		},
	);
}

export const documents = {
	sanitize,
	updateLastVersionFlags,
};
