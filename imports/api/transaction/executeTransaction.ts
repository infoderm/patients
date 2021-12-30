import {Meteor} from 'meteor/meteor';
import {MongoInternals} from 'meteor/mongo';
import {SessionOptions, TransactionOptions} from 'mongodb';

import ClientSessionWrapper from './ClientSessionWrapper';
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
	const session = client.startSession(sessionOptions);
	session.startTransaction(transactionOptions);
	try {
		const wrap = new ClientSessionWrapper(session);
		const result = await transaction(wrap);
		await session.commitTransaction();
		return result;
	} catch (error: unknown) {
		await session.abortTransaction();
		const message = error instanceof Error ? error.message : 'unknown error';
		console.error(message);
		console.debug({error});
		throw new Meteor.Error('Database Transaction Failed', message);
	} finally {
		session.endSession();
	}
};

export default executeTransaction;
