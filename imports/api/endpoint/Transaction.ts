import TransactionDriver from '../transaction/TransactionDriver';

type Transaction = (db: TransactionDriver, ...args: any[]) => Promise<any>;

export default Transaction;
