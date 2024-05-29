import {type ClientSession, type TransactionOptions} from 'mongodb';

import MongoTransactionExecutionDriver from './MongoTransactionExecutionDriver';
import type Transaction from './Transaction';

/**
 * See https://forums.meteor.com/t/solved-transactions-with-mongodb-meteor-methods/48677.
 */
const withTransactionDriver = async <R>(
	session: ClientSession,
	transaction: Transaction<R>,
	transactionOptions?: TransactionOptions,
) => {
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
	}

	return result;
};

export default withTransactionDriver;
