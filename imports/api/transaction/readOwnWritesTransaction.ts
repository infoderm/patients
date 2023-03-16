import executeTransaction from './executeTransaction';
import type Transaction from './Transaction';

const readOwnWritesTransaction = async <R>(transaction: Transaction<R>) =>
	executeTransaction(transaction, {readConcern: {level: 'local'}});

export default readOwnWritesTransaction;
