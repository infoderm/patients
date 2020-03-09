import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
//import { Binary } from 'meteor/mongo';
import { check } from 'meteor/check';

import iconv from 'iconv-lite' ;

import { zip } from '@aureooms/js-itertools' ;
import { list } from '@aureooms/js-itertools' ;
import { map } from '@aureooms/js-itertools' ;
import { enumerate } from '@aureooms/js-itertools' ;

import parseHealthOne from 'healthone/lib/parse' ;
import chardet from 'chardet' ;

import { normalized } from './string.js';

import { Patients } from './patients.js';

export const Documents = new Mongo.Collection('documents');

if (Meteor.isServer) {

	Meteor.publish('documents', function () {
		return Documents.find({ owner: this.userId });
	});

	Meteor.publish('documents.unlinked', function () {
		return Documents.find({
			owner: this.userId,
			patientId: null,
		});
	});

	Meteor.publish('documents.page', function (page, perpage) {
		check(page, Number);
		check(perpage, Number);
		return Documents.find({
			owner: this.userId
		}, {
			sort: { createdAt: -1 },
			skip: page*perpage,
			limit: perpage
		});
	});

	Meteor.publish('document', function (_id) {
		return Documents.find({ owner: this.userId , _id });
	});

	Meteor.publish('patient.documents', function (patientId) {
		check(patientId, String);
		return Documents.find({
			owner: this.userId ,
			patientId: patientId
		});
	});

}

//const utfLabelToEncoding = {
	//'iso-8859-1': 'windows-1252',
//} ;

function sanitize ( {
	patientId,
	format,
	array,
} ) {

	patientId === undefined || check(patientId, String);
	check(format, String);
	check(array, Uint8Array);

	console.debug('Starting to sanitize');

	const mangled = (new TextDecoder('utf-8', {fatal: false})).decode(array.buffer, {stream: false});

	try {

		console.debug('trying to detect encoding...');
		//const utfLabel = chardet.detect(array).toLowerCase();
		//const encoding = utfLabelToEncoding[utfLabel] || utfLabel;
		const encoding = chardet.detect(array).toLowerCase();
		console.debug('encoding', encoding);
		//console.debug('constructing decoder');
		//const decoder = new TextDecoder(encoding, {fatal: true});
		//console.debug('trying to decode with', decoder, '...');
		//const decoded = decoder.decode(array.buffer, {stream: false});
		console.debug('trying to decode with iconv...');
		const decoded = iconv.decode(array, encoding);
		console.debug('worked!');

		if (format === 'healthone') {
			try {
				const entries = [];
				const mangledDocuments= parseHealthOne(mangled);
				const documents = parseHealthOne(decoded);
				if (mangledDocuments.length !== documents.length) {
					throw new Error('Number of entries do not match.');
				}
				for ( const [document, mangledDocument] of zip(documents, mangledDocuments) ) {
					//const utf8_array = (new TextEncoder()).encode(decoded);
					//const utf8_buffer = utf8_array.buffer;
					//const utf8_binary = Binary(utf8_buffer);
					const entry = {
						...document,
						patientId,
						format,
						source: mangledDocument.source.join('\n'),
						encoding,
						decoded: document.source.join('\n'),
						//binary: utf8_binary,
						parsed: true,
					} ;
					entries.push(entry);
				}
				return entries;
			}
			catch (e) {
				console.error('Failed to parse Health One document.', e);
			}
		}

		return [ {
			patientId,
			format,
			parsed: false,
			source: mangled,
			//binary: Binary(buffer),
			encoding,
			decoded,
		} ] ;

	}

	catch (e) {
		console.error('Failed to decode document buffer', e);
	}


	return [ {
		patientId,
		format,
		source: mangled,
		parsed: false,
		//binary: Binary(buffer),
	} ] ;

}

function normalizedName ( firstname , lastname ) {
	return normalized(`${lastname.replace(' ', '-')} ${firstname}`).split(' ');
}

function findBestPatientMatch ( owner, entry ) {

	if (entry.patientId) return entry.patientId;

	if (!entry.patient) return undefined;

	const matches = [];

	const {
		nn,
		firstname,
		lastname,
	} = entry.patient ;

	if (nn) {
		const patient = Patients.findOne({owner, niss: nn});
		if (patient) return patient._id;
	}

	if (firstname && lastname) {
		const [hash1, hash2] = normalizedName(firstname, lastname);

		const patients = Patients.find({owner}).fetch();

		for (const candidate of patients) {
			const [cHash1, cHash2] = normalizedName(candidate.firstname, candidate.lastname);
			if (hash1 === cHash1 && hash2 === cHash2) matches.push(candidate._id);
		}
	}

	if (matches.length === 1) return matches[0];

	// if 0 or more than 1 matches
	return undefined;

}

Meteor.methods({

	'documents.insert'(document) {

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const entries = sanitize(document);

		const result = [];

		for ( const entry of entries ) {

			// Find best patient match for this document

			const patientId = findBestPatientMatch(this.userId, entry);

			// Find document with matching source

			const existingDocument = Documents.findOne({
				owner: this.userId ,
				source: entry.source ,
			});

			if ( !existingDocument ) {

				// Only create new document if there is no other document with
				// matching source

				const _id = Documents.insert({
					...entry,
					patientId,
					createdAt: new Date(),
					owner: this.userId,
				});

				result.push(_id);

			}

			else {

				// We update the document if we found a matching patient and no
				// patient had been assigned before.

				if (!existingDocument.patientId && patientId) {
					// TODO Test this on all documents without a patientId when
					// creating a new patient.
					Documents.update(existingDocument._id, { $set: { patientId } });
				}

				// We update the document if it did not have a binary field before.

				//if (!existingDocument.binary) {
					//Documents.update(existingDocument._id, {
						//$set: {
							//binary: entry.binary,
						//}
					//});
				//}

				// We update the document if it had not been properly decoded before.

				if (existingDocument.parsed && existingDocument.decoded !== entry.decoded) {
					Documents.update(existingDocument._id, {
						$set: {
							...entry,
							patientId,
						}
					});
				}

				result.push(existingDocument._id);

			}

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
		return Documents.update(documentId, { $set: { patientId } });
	},

	'documents.unlink'(documentId) {
		check(documentId, String);
		const document = Documents.findOne(documentId);
		if (!document || document.owner !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own document');
		}
		return Documents.update(documentId, { $unset: { patientId: '' } });
	},

	'documents.delete'(documentId){
		//check(documentId, String);
		const document = Documents.findOne(documentId);
		if (!document || document.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		return Documents.update(documentId, { $set: { deleted: true } });
	},

	'documents.restore'(documentId){
		//check(documentId, String);
		const document = Documents.findOne(documentId);
		if (!document || document.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		return Documents.update(documentId, { $set: { deleted: false } });
	},

	'documents.superdelete'(documentId){
		//check(documentId, String);
		const document = Documents.findOne(documentId);
		if (!document || document.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		return Documents.remove(documentId);
	},

});

export const documents = {
	sanitize,
};
