import executeTransaction from './executeTransaction';
import type Transaction from './Transaction';

const snapshotTransaction = async (transaction: Transaction) =>
	executeTransaction(transaction, {readConcern: {level: 'snapshot'}});

export default snapshotTransaction;
