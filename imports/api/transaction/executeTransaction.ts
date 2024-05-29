import {type ClientSessionOptions, type TransactionOptions} from 'mongodb';

import withSession from './withSession';
import withTransactionDriver from './withTransactionDriver';
import type Transaction from './Transaction';

/**
 * See https://forums.meteor.com/t/solved-transactions-with-mongodb-meteor-methods/48677.
 */
const executeTransaction = async <R>(
	transaction: Transaction<R>,
	transactionOptions?: TransactionOptions,
	sessionOptions?: ClientSessionOptions,
) =>
	withSession(
		async (session) =>
			withTransactionDriver(session, transaction, transactionOptions),
		sessionOptions,
	);

export default executeTransaction;
