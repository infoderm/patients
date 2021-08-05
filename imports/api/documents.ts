import {Buffer} from 'buffer';

import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
// Import { Binary } from 'meteor/mongo';
import {check} from 'meteor/check';

import {zip} from '@iterable-iterator/zip';

import pageQuery from './pageQuery';
import {Patients, patients} from './patients';

export const Documents = new Mongo.Collection<any>('documents');

if (Meteor.isServer) {
	Meteor.publish('documents', pageQuery(Documents));

	Meteor.publish('document', function (_id) {
		return Documents.find({owner: this.userId, _id});
	});

	Meteor.publish('patient.documents', function (patientId, options) {
		check(patientId, String);
		return Documents.find(
			{
				owner: this.userId,
				patientId,
				lastVersion: true,
				deleted: false
			},
			options
		);
	});

	Meteor.publish('patient.documents.all', function (patientId, options) {
		check(patientId, String);
		return Documents.find(
			{
				owner: this.userId,
				patientId
			},
			options
		);
	});
}

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
		{stream: false}
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
					mangledDocuments
				)) {
					// Const utf8_array = (new TextEncoder()).encode(decoded);
					// const utf8_buffer = utf8_array.buffer;
					// const utf8_binary = Binary(utf8_buffer);
					const entry = {
						...document,
						patientId,
						format,
						source: mangledDocument.source.join('\n'),
						encoding,
						decoded: document.source.join('\n'),
						// Binary: utf8_binary,
						parsed: true
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
				lastVersion: true
			}
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
			lastVersion: true
			// Binary: Binary(buffer),
		}
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

function findBestPatientMatchServerOnly(owner, entry) {
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
			deleted: false
		},
		{
			sort: {
				status: 1, // Complete < partial
				datetime: -1
			}
		}
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
			_id: {$ne: latest._id}
		},
		{
			$set: {
				lastVersion: false
			}
		},
		{
			multi: true
		}
	);
}

Meteor.methods({
	async 'documents.insert'(document) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const entries = await sanitize(document);

		const result = [];

		for (const entry of entries) {
			// Find best patient match for this document

			const patientId = findBestPatientMatchServerOnly(this.userId, entry);

			// Find document with matching source

			const existingDocument = Documents.findOne({
				owner: this.userId,
				source: entry.source
			});

			if (!existingDocument) {
				// Only create new document if there is no other document with
				// matching source

				const _id = Documents.insert({
					...entry,
					patientId,
					deleted: false,
					createdAt: new Date(),
					owner: this.userId
				});

				result.push(_id);
			} else {
				// We update the document if we found a matching patient and no
				// patient had been assigned before.

				if (!existingDocument.patientId && patientId) {
					// TODO Test this on all documents without a patientId when
					// creating a new patient.
					Documents.update(existingDocument._id, {$set: {patientId}});
				}

				// We update the document if it did not have a binary field before.

				// if (!existingDocument.binary) {
				// Documents.update(existingDocument._id, {
				// $set: {
				// binary: entry.binary,
				// }
				// });
				// }

				// We update the document if it had not been properly decoded before.

				if (
					existingDocument.parsed &&
					(existingDocument.encoding !== entry.encoding ||
						existingDocument.decoded !== entry.decoded)
				) {
					Documents.update(existingDocument._id, {
						$set: {
							...entry,
							patientId
						}
					});
				}

				if (!existingDocument.parsed && !existingDocument.lastVersion) {
					Documents.update(existingDocument._id, {$set: {lastVersion: true}});
				}

				result.push(existingDocument._id);
			}

			updateLastVersionFlags(this.userId, entry);
		}

		return result;
	},

	'documents.link'(documentId, patientId) {
		check(documentId, String);
		check(patientId, String);
		const document = Documents.findOne(documentId);
		const patient = Patients.findOne(patientId);
		if (!document || document.owner !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own document');
		}

		if (!patient || patient.owner !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own patient');
		}

		return Documents.update(documentId, {$set: {patientId}});
	},

	'documents.unlink'(documentId) {
		check(documentId, String);
		const document = Documents.findOne(documentId);
		if (!document || document.owner !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own document');
		}

		return Documents.update(documentId, {$unset: {patientId: ''}});
	},

	'documents.delete'(documentId) {
		// Check(documentId, String);
		const document = Documents.findOne(documentId);
		if (!document || document.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Documents.update(documentId, {$set: {deleted: true}});
		updateLastVersionFlags(this.userId, document);
	},

	'documents.restore'(documentId) {
		// Check(documentId, String);
		const document = Documents.findOne(documentId);
		if (!document || document.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Documents.update(documentId, {$set: {deleted: false}});
		updateLastVersionFlags(this.userId, document);
	},

	'documents.superdelete'(documentId) {
		// Check(documentId, String);
		const document = Documents.findOne(documentId);
		if (!document || document.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Documents.remove(documentId);
		updateLastVersionFlags(this.userId, document);
	}
});

export const documents = {
	sanitize,
	updateLastVersionFlags
};
