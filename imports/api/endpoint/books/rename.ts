import {check} from 'meteor/check';

import {Consultations} from '../../collection/consultations';
import {Books} from '../../collection/books';
import {books} from '../../books';
import {parseUint32StrictOrString} from '../../string';

import define from '../define';
import type TransactionDriver from '../../transaction/TransactionDriver';

export default define({
	name: 'books.changeBookNumber',
	validate(oldBookId: string, newBookNumberString: string) {
		check(oldBookId, String);
		check(newBookNumberString, String);
	},
	async transaction(
		db: TransactionDriver,
		oldBookId: string,
		newBookNumberString: string,
	) {
		const oldBook = await db.findOne(Books, {
			_id: oldBookId,
			owner: this.userId,
		});
		if (oldBook === null) {
			throw new Meteor.Error('not-found');
		}

		const {name: oldName, fiscalYear, bookNumber: oldBookNumber} = oldBook;

		newBookNumberString = books.sanitize(newBookNumberString);
		if (newBookNumberString === '') {
			throw new Meteor.Error('value-error');
		}

		const newBookNumber = parseUint32StrictOrString(newBookNumberString);
		if (newBookNumber === oldBookNumber) {
			throw new Meteor.Error('value-error');
		}

		const newName = books.format(fiscalYear, newBookNumber);
		const newBookId = await books.add(db, this.userId, newName);

		const query = {
			...books.selector(oldName),
			owner: this.userId,
			isDone: true,
		};

		await db.updateMany(Consultations, query, {
			$set: {book: newBookNumber.toString()},
		});

		await db.deleteOne(Books, {_id: oldBookId});
		return newBookId;
	},
});
