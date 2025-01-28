import assert from 'assert';

import {asyncIterableToArray} from '@async-iterable-iterator/async-iterable-to-array';

import {documents} from '../../api/documents';
import forEachAsync from '../../api/transaction/forEachAsync';
import {Documents} from '../../api/collection/documents';

export default async () => {
	// Migrate to healthone v7
	await forEachAsync(
		Documents,
		{
			parsed: true,
			format: 'healthone',
			kind: 'report',
			text: {$exists: true},
		},
		async (
			db,
			{_id, owner, createdAt, patientId, encoding, decoded, parsed},
		) => {
			// NOTE: We only handle parsed documents.
			assert(parsed);
			assert(encoding !== undefined);
			assert(decoded !== undefined);

			const array = new TextEncoder().encode(decoded);

			const document = {
				patientId,
				format: 'healthone',
				array,
			};

			const entries = await asyncIterableToArray(documents.sanitize(document));
			assert(entries.length === 1);
			const entry = entries[0];
			assert(entry.parsed);
			assert(entry.encoding !== undefined);
			assert(entry.decoded !== undefined);
			assert(entry.text === undefined);
			assert(entry.sections !== undefined);

			const {insertedId} = await db.insertOne(Documents, {
				...entry,
				createdAt,
				owner,
			});
			console.debug('Inserted new parsed document', insertedId);

			console.debug('Removing old document', _id);
			await db.deleteOne(Documents, {_id});
		},
	);
};
