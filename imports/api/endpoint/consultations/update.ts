import {
	Consultations,
	type ConsultationDocument,
	consultationFields,
} from '../../collection/consultations';
import {Patients} from '../../collection/patients';

import {consultations, computeUpdate} from '../../consultations';

import {books} from '../../books';

import define from '../define';
import {availability} from '../../availability';
import type TransactionDriver from '../../transaction/TransactionDriver';
import type Modifier from '../../Modifier';
import {AuthenticationLoggedIn} from '../../Authentication';
import schema from '../../../lib/schema';
import {documentUpdate} from '../../DocumentUpdate';

const {sanitize} = consultations;

export default define({
	name: 'consultations.update',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string(), documentUpdate(consultationFields)]),
	async transaction(db: TransactionDriver, consultationId, newfields) {
		const owner = this.userId;
		const existing = await db.findOne(Consultations, {
			_id: consultationId,
			owner,
		});
		if (existing === null) {
			throw new Meteor.Error('not-found');
		}

		const changes = sanitize(newfields);
		const {$set, $unset, newState} = await computeUpdate(
			db,
			owner,
			existing,
			changes,
		);
		if ($set?.patientId) {
			const patient = await db.findOne(Patients, {
				_id: $set.patientId,
				owner,
			});
			if (patient === null) {
				throw new Meteor.Error('not-found');
			}
		}

		if (newState.datetime && newState.book) {
			await books.add(db, owner, books.name(newState.datetime, newState.book));
		}

		const modifier: Modifier<ConsultationDocument> = {
			$currentDate: {lastModifiedAt: true},
			$set,
			$unset,
		};

		const {
			begin: oldBegin,
			end: oldEnd,
			isDone: oldIsDone,
			isCancelled: oldIsCancelled,
		} = existing;
		const oldWeight = oldIsDone || oldIsCancelled ? 0 : 1;
		const newBegin = $set.begin ?? oldBegin;
		const newEnd = $set.end ?? oldEnd;
		const newIsDone = $set.isDone ?? oldIsDone;
		const newIsCancelled = oldIsCancelled;
		const newWeight = newIsDone || newIsCancelled ? 0 : 1;
		await availability.updateHook(
			db,
			owner,
			oldBegin,
			oldEnd,
			oldWeight,
			newBegin,
			newEnd,
			newWeight,
		);

		return db.updateOne(Consultations, {_id: consultationId}, modifier);
	},
	simulate(_consultationId, _newfields) {
		return undefined;
	},
});
