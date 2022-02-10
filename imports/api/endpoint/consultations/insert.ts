import {check} from 'meteor/check';

import {Consultations} from '../../collection/consultations';

import {computedFields, consultations} from '../../consultations';

import {books} from '../../books';

import define from '../define';
import {availability} from '../../availability';
import TransactionDriver from '../../transaction/TransactionDriver';
import {Patients} from '../../collection/patients';

const {sanitize} = consultations;

export default define({
	name: 'consultations.insert',
	validate(consultation: any) {
		check(consultation, Object);
	},
	async transaction(db: TransactionDriver, consultation: any) {
		const fields = sanitize(consultation);
		const owner = this.userId;

		const patient = await db.findOne(Patients, {_id: fields.patientId, owner});

		if (patient === null) {
			throw new Meteor.Error('not-found');
		}

		if (fields.datetime && fields.book) {
			await books.add(
				db,
				this.userId,
				books.name(fields.datetime, fields.book),
			);
		}

		const createdAt = new Date();
		const lastModifiedAt = createdAt;

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
	simulate(_consultation: any): void {
		return undefined;
	},
});
