// Import { Binary } from 'meteor/mongo';
import {check} from 'meteor/check';

import {Documents} from './collection/documents';
import decodeText from './documents/decodeText';
import detectTextEncoding from './documents/detectTextEncoding';
import parseHealthOne from './documents/parseHealthOne';
import parseMedidoc from './documents/parseMedidoc';
import TransactionDriver from './transaction/TransactionDriver';

const DETECT_REGEX_HEALTHONE = /^A1\\\d+\\/;
const DETECT_REGEX_MEDIDOC_DOCTOR = /^\d\/\d{5}\/\d{2}\/\d{3}[\r\n]/;
const DETECT_REGEX_MEDIDOC_LAB = /^[A-Z]\d{3}[\r\n]/;

const detectFormats = (string: string): Record<string, number> => ({
	healthone: DETECT_REGEX_HEALTHONE.test(string) ? 1 : 0,
	'DMA-REP': DETECT_REGEX_MEDIDOC_DOCTOR.test(string) ? 1 : 0,
	'DMA-LAB': DETECT_REGEX_MEDIDOC_LAB.test(string) ? 1 : 0,
});

const detectFormat = (string: string): string | undefined => {
	const formats = detectFormats(string);
	const matches = Object.entries(formats)
		.filter(([, value]) => value === 1)
		.map(([key]) => key);
	return matches.length === 1 ? matches[0] : undefined;
};

interface DirtyDocument {
	patientId: string;
	format?: string;
	array: Uint8Array;
}

async function* sanitize({
	patientId,
	format: formatHint,
	array,
}: DirtyDocument) {
	if (patientId !== undefined) check(patientId, String);
	if (formatHint !== undefined) check(formatHint, String);
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
		if (encoding === null) {
			throw new Error('could not detect text encoding');
		}

		console.debug('trying to decode...');
		const decoded = await decodeText(encoding, array);
		console.debug('worked!');

		const format = formatHint ?? detectFormat(decoded);

		try {
			if (format === 'healthone') {
				for await (const document of parseHealthOne(decoded, mangled)) {
					yield {
						...document,
						patientId,
						format,
						encoding,
					};
				}

				return;
			}

			if (format === 'DMA-REP') {
				for await (const document of parseMedidoc(decoded, mangled)) {
					yield {
						...document,
						patientId,
						format,
						encoding,
					};
				}

				return;
			}

			throw new Error(`unknown format: ${format}`);
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : 'unknown parsing error';
			console.error(`Failed to parse ${format} document.`);
			console.error(`The error message is: ${message}`);
			console.debug({error});
		}

		yield {
			patientId,
			format: formatHint,
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
		format: formatHint,
		parsed: false,
		source: mangled,
		lastVersion: true,
		// Binary: Binary(buffer),
	};
}

async function updateLastVersionFlags(db: TransactionDriver, owner, document) {
	if (!document.parsed) {
		return;
	}

	const {identifier, reference} = document;

	const latest = await db.findOne(
		Documents,
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
				createdAt: -1,
			},
		},
	);

	if (latest === null) {
		return;
	}

	await db.updateOne(Documents, {_id: latest._id}, {$set: {lastVersion: true}});

	await db.updateMany(
		Documents,
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
	);
}

export const documents = {
	sanitize,
	updateLastVersionFlags,
};
