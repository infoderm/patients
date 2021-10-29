// Import { Binary } from 'meteor/mongo';
import {check} from 'meteor/check';

import {Documents} from './collection/documents';
import decodeText from './documents/decodeText';
import detectTextEncoding from './documents/detectTextEncoding';
import parseHealthOne from './documents/parseHealthOne';

async function* sanitize({patientId, format, array}) {
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
		const encoding = await detectTextEncoding(array);
		console.debug('encoding', encoding);
		console.debug('trying to decode...');
		const decoded = await decodeText(encoding, array);
		console.debug('worked!');

		try {
			switch (format) {
				case 'healthone':
					for await (const document of parseHealthOne(decoded, mangled)) {
						yield {
							...document,
							patientId,
							format,
							encoding,
						};
					}

					return;
				default:
					throw new Error(`unknown format: ${format}`);
			}
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : 'unknown parsing error';
			console.error(`Failed to parse ${format} document.`);
			console.error(`The error message is: ${message}`);
			console.debug({error});
		}

		yield {
			patientId,
			format,
			parsed: false,
			source: mangled,
			// Binary: Binary(buffer),
			encoding,
			decoded,
			lastVersion: true,
		};
		return;
	} catch (error: unknown) {
		console.error('Failed to decode document buffer', error);
	}

	yield {
		patientId,
		format,
		source: mangled,
		parsed: false,
		lastVersion: true,
		// Binary: Binary(buffer),
	};
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
