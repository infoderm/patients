import executeTransaction from './executeTransaction';
import type Transaction from './Transaction';

const snapshotTransaction = async <R>(transaction: Transaction<R>) =>
	executeTransaction(transaction, {readConcern: {level: 'snapshot'}});

export default snapshotTransaction;
