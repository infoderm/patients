import {MongoInternals} from 'meteor/mongo';
import {type ClientSessionOptions, type TransactionOptions} from 'mongodb';

import MongoTransactionExecutionDriver from './MongoTransactionExecutionDriver';
import type Transaction from './Transaction';

/**
 * See https://forums.meteor.com/t/solved-transactions-with-mongodb-meteor-methods/48677.
 */
const executeTransaction = async <R>(
	transaction: Transaction<R>,
	transactionOptions?: TransactionOptions,
	sessionOptions?: ClientSessionOptions,
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
		const driver = new MongoTransactionExecutionDriver(session);
		await session.withTransaction(async () => {
			result = await transaction(driver);
		}, transactionOptions);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'unknown error';
		console.debug('Database Transaction Failed:');
		console.debug(message);
		console.debug({error});
		throw error;
	} finally {
		// No need to await this Promise, this is just used to free-up
		// resources.
		session.endSession().catch((error) => {
			console.error('Call to endSession failed:', error);
		});
	}

	return result;
};

export default executeTransaction;
