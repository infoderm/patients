import {check} from 'meteor/check';

import {Consultations} from '../../collection/consultations';
import {Books} from '../../collection/books';
import {books} from '../../books';
import {parseUint32StrictOrString} from '../../string';

import define from '../define';

export default define({
	name: 'books.changeBookNumber',
	validate(oldBookId: string, newBookNumberString: string) {
		check(oldBookId, String);
		check(newBookNumberString, String);
	},
	run(oldBookId: string, newBookNumberString: string) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const oldBook = Books.findOne({_id: oldBookId, owner: this.userId});
		if (!oldBook) {
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
		const newBookId = books.add(this.userId, newName);

		const query = {
			...books.selector(oldName),
			owner: this.userId,
			isDone: true,
		};

		Consultations.update(
			query,
			{
				$set: {book: newBookNumber.toString()},
			},
			{multi: true},
		);

		Books.remove(oldBookId);
		return newBookId;
	},
});
