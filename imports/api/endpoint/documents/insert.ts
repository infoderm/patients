import {check} from 'meteor/check';

import {Documents} from '../../collection/documents';
import {documents} from '../../documents';
import findBestPatientMatch from '../../documents/findBestPatientMatch';
import executeTransaction from '../../transaction/executeTransaction';

import define from '../define';

const {sanitize, updateLastVersionFlags} = documents;

export default define({
	name: 'documents.insert',
	validate(document: any) {
		check(document, Object);
	},
	async run(document: any) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const entries = sanitize(document);

		const result = [];

		for await (const entry of entries) {
			// TODO split to new invoked method
			await executeTransaction(async (db) => {
				// Find best patient match for this document

				const patientId = await findBestPatientMatch(db, this.userId, entry);

				// Find document with matching source

				const existingDocument = await db.findOne(Documents, {
					owner: this.userId,
					source: entry.source,
				});

				if (existingDocument === null) {
					// Only create new document if there is no other document with
					// matching source

					const {insertedId} = await db.insertOne(Documents, {
						...entry,
						patientId,
						deleted: false,
						createdAt: new Date(),
						owner: this.userId,
					});

					result.push(insertedId);
				} else {
					// We update the document if we found a matching patient and no
					// patient had been assigned before.

					if (!existingDocument.patientId && patientId) {
						// TODO Test this on all documents without a patientId when
						// creating a new patient.
						await db.updateOne(
							Documents,
							{_id: existingDocument._id},
							{$set: {patientId}},
						);
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
						await db.updateOne(
							Documents,
							{_id: existingDocument._id},
							{
								$set: {
									...entry,
									patientId,
								},
							},
						);
					}

					if (!existingDocument.parsed && !existingDocument.lastVersion) {
						await db.updateOne(
							Documents,
							{_id: existingDocument._id},
							{$set: {lastVersion: true}},
						);
					}

					result.push(existingDocument._id);
				}

				await updateLastVersionFlags(db, this.userId, entry);
			});
		}

		return result;
	},
	simulate(_document: any) {
		throw new Error('simulation not-implemented');
	},
});
