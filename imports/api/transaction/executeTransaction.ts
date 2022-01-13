import {Meteor} from 'meteor/meteor';
import {MongoInternals} from 'meteor/mongo';
import {SessionOptions, TransactionOptions} from 'mongodb';

import MongoDBClientSessionWrapper from './ClientSessionWrapper';
import Transaction from './Transaction';

/**
 * See https://forums.meteor.com/t/solved-transactions-with-mongodb-meteor-methods/48677.
 */
const executeTransaction = async (
	transaction: Transaction,
	transactionOptions?: TransactionOptions,
	sessionOptions?: SessionOptions,
) => {
	const {client} = MongoInternals.defaultRemoteCollectionDriver().mongo;
	// NOTE causalConsistency: true is the default but better be explicit
	// see https://www.youtube.com/watch?v=x5UuQL9rA1c
	const session = client.startSession({
		causalConsistency: true,
		...sessionOptions,
	});
	let result;
	try {
		const wrap = new MongoDBClientSessionWrapper(session);
		await session.withTransaction(async () => {
			result = await transaction(wrap);
		}, transactionOptions);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'unknown error';
		console.debug(message);
		console.debug({error});
		throw new Meteor.Error('Database Transaction Failed', message);
	} finally {
		// No need to await this Promise, this is just used to free-up
		// resources.
		session.endSession();
	}

	return result;
};

export default executeTransaction;
