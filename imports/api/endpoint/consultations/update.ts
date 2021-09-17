import {check} from 'meteor/check';

import {
	Consultations,
	ConsultationDocument,
} from '../../collection/consultations';

import {consultations, computedFields} from '../../consultations';

import {books} from '../../books';

import define from '../define';
import {availability} from '../../availability';

const {sanitize} = consultations;

export default define({
	name: 'consultations.update',
	validate(consultationId: string, newfields: any) {
		check(consultationId, String);
		check(newfields, Object);
	},
	run(consultationId: string, newfields: any) {
		const owner = this.userId;
		const existing = Consultations.findOne({
			_id: consultationId,
			owner,
		});
		if (!existing) {
			throw new Meteor.Error('not-found');
		}

		const fields = sanitize(newfields);
		if (fields.datetime && fields.book) {
			books.add(owner, books.name(fields.datetime, fields.book));
		}

		let $unset;

		if (
			Object.prototype.hasOwnProperty.call(newfields, 'price') &&
			fields.price === undefined
		) {
			$unset = {
				...$unset,
				price: true,
			};
		}

		if (
			Object.prototype.hasOwnProperty.call(newfields, 'paid') &&
			fields.paid === undefined
		) {
			$unset = {
				...$unset,
				paid: true,
			};
		}

		const $set = {
			...fields,
			...computedFields(owner, existing, fields),
		};

		const modifier: Mongo.Modifier<ConsultationDocument> = {
			$set,
			$currentDate: {lastModifiedAt: true},
		};

		if ($unset !== undefined) modifier.$unset = $unset;

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
		availability.updateHook(
			owner,
			oldBegin,
			oldEnd,
			oldWeight,
			newBegin,
			newEnd,
			newWeight,
		);

		return Consultations.update(consultationId, modifier);
	},
});
