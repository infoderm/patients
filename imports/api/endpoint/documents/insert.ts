import {check} from 'meteor/check';

import {Documents} from '../../collection/documents';
import {documents} from '../../documents';
import findBestPatientMatch from '../../documents/findBestPatientMatch';

import define from '../define';

const {sanitize, updateLastVersionFlags} = documents;

export default define({
	name: 'documents.insert',
	validate(document: any) {
		check(document, Object);
	},
	async run(document: any) {
		// TODO make atomic
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const entries = sanitize(document);

		const result = [];

		for await (const entry of entries) {
			// Find best patient match for this document

			const patientId = findBestPatientMatch(this.userId, entry);

			// Find document with matching source

			const existingDocument = Documents.findOne({
				owner: this.userId,
				source: entry.source,
			});

			if (!existingDocument) {
				// Only create new document if there is no other document with
				// matching source

				const _id = Documents.insert({
					...entry,
					patientId,
					deleted: false,
					createdAt: new Date(),
					owner: this.userId,
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
							patientId,
						},
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
});
