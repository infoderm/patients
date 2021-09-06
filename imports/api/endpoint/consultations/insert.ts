import {check} from 'meteor/check';

import {Consultations} from '../../collection/consultations';

import {computedFields, consultations} from '../../consultations';

import {books} from '../../books';

import define from '../define';

const {sanitize} = consultations;

export default define({
	name: 'consultations.insert',
	validate(consultation: any) {
		check(consultation, Object);
	},
	run(consultation: any) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const fields = sanitize(consultation);

		if (fields.datetime && fields.book) {
			books.add(this.userId, books.name(fields.datetime, fields.book));
		}

		const createdAt = new Date();
		const lastModifiedAt = createdAt;

		return Consultations.insert({
			...fields,
			...computedFields(this.userId, undefined, fields),
			createdAt,
			lastModifiedAt,
			owner: this.userId,
		});
	},
});
