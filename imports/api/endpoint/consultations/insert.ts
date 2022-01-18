import {check} from 'meteor/check';

import {Consultations} from '../../collection/consultations';

import {computedFields, consultations} from '../../consultations';

import {books} from '../../books';

import define from '../define';
import {availability} from '../../availability';
import Wrapper from '../../transaction/Wrapper';

const {sanitize} = consultations;

export default define({
	name: 'consultations.insert',
	validate(consultation: any) {
		check(consultation, Object);
	},
	async transaction(db: Wrapper, consultation: any) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const fields = sanitize(consultation);

		if (fields.datetime && fields.book) {
			await books.add(
				db,
				this.userId,
				books.name(fields.datetime, fields.book),
			);
		}

		const createdAt = new Date();
		const lastModifiedAt = createdAt;

		const owner = this.userId;
		const document = {
			...fields,
			...computedFields(this.userId, undefined, fields),
			createdAt,
			lastModifiedAt,
			owner,
		};

		const {begin, end} = document;

		await availability.insertHook(db, owner, begin, end, 0);

		return db.insertOne(Consultations, document);
	},
});
