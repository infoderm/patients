import {check} from 'meteor/check';

import {
	Consultations,
	ConsultationDocument,
} from '../../collection/consultations';

import {consultations, computedFields} from '../../consultations';

import {books} from '../../books';

import define from '../define';

const {sanitize} = consultations;

export default define({
	name: 'consultations.update',
	validate(consultationId: string, newfields: any) {
		check(consultationId, String);
		check(newfields, Object);
	},
	run(consultationId: string, newfields: any) {
		const existing = Consultations.findOne({
			_id: consultationId,
			owner: this.userId,
		});
		if (!existing) {
			throw new Meteor.Error('not-found');
		}

		const fields = sanitize(newfields);
		if (fields.datetime && fields.book) {
			books.add(this.userId, books.name(fields.datetime, fields.book));
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

		const updateDocument: Mongo.Modifier<ConsultationDocument> = {
			$set: {
				...fields,
				...computedFields(this.userId, existing, fields),
			},
			$currentDate: {lastModifiedAt: true},
		};

		if ($unset !== undefined) updateDocument.$unset = $unset;

		return Consultations.update(consultationId, updateDocument);
	},
});
