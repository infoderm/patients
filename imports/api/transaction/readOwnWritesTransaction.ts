import executeTransaction from './executeTransaction';
import Transaction from './Transaction';

const readOwnWritesTransaction = async (transaction: Transaction) =>
	executeTransaction(transaction, {readConcern: {level: 'local'}});

export default readOwnWritesTransaction;
