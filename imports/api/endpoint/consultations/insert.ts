import assert from 'assert';

import {
	Consultations,
	consultationFields,
} from '../../collection/consultations';

import {computeUpdate, consultations} from '../../consultations';

import {books} from '../../books';

import define from '../define';
import {availability} from '../../availability';
import type TransactionDriver from '../../transaction/TransactionDriver';
import {Patients} from '../../collection/patients';
import {AuthenticationLoggedIn} from '../../Authentication';
import schema from '../../../lib/schema';
import {documentUpdate} from '../../DocumentUpdate';

const {sanitize} = consultations;

export default define({
	name: 'consultations.insert',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([documentUpdate(consultationFields)]),
	async transaction(db: TransactionDriver, consultation) {
		const owner = this.userId;
		const changes = sanitize(consultation);
		const {$set, $unset, newState} = await computeUpdate(
			db,
			owner,
			undefined,
			changes,
		);

		assert(
			$unset === undefined ||
				!Object.keys($unset).some((key) =>
					Object.prototype.hasOwnProperty.call(newState, key),
				),
		);

		const patient = await db.findOne(Patients, {_id: $set.patientId, owner});

		if (patient === null) {
			throw new Meteor.Error('not-found');
		}

		if (newState.datetime && newState.book) {
			await books.add(db, owner, books.name(newState.datetime, newState.book));
		}

		const createdAt = new Date();
		const lastModifiedAt = createdAt;

		const document = {
			...$set,
			createdAt,
			lastModifiedAt,
			owner,
		};

		const {begin, end} = document;

		assert(begin !== undefined);
		assert(end !== undefined);

		await availability.insertHook(db, owner, begin, end, 0);

		return db.insertOne(Consultations, document);
	},
	simulate(_consultation: any) {
		return undefined;
	},
});
