import {Consultations} from '../../collection/consultations';
import {Books} from '../../collection/books';
import {books} from '../../books';
import {parseUint32StrictOrString} from '../../string';

import define from '../define';
import type TransactionDriver from '../../transaction/TransactionDriver';
import {AuthenticationLoggedIn} from '../../Authentication';
import EndpointError from '../EndpointError';
import schema from '../../../lib/schema';

export default define({
	name: 'books.changeBookNumber',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string(), schema.string()]),
	async transaction(db: TransactionDriver, oldBookId, newBookNumberString) {
		const oldBook = await db.findOne(Books, {
			_id: oldBookId,
			owner: this.userId,
		});
		if (oldBook === null) {
			throw new EndpointError('not-found');
		}

		const {name: oldName, fiscalYear, bookNumber: oldBookNumber} = oldBook;

		newBookNumberString = books.sanitize(newBookNumberString);
		if (newBookNumberString === '') {
			throw new EndpointError('value-error');
		}

		const newBookNumber = parseUint32StrictOrString(newBookNumberString);
		if (newBookNumber === oldBookNumber) {
			throw new EndpointError('value-error');
		}

		const newName = books.format(fiscalYear, newBookNumber);
		const newBookId = await books.add(db, this.userId, newName);

		const query = {
			...books.filter(oldName),
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
