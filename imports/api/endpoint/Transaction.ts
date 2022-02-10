import TransactionDriver from '../transaction/TransactionDriver';

type Transaction<R> = (db: TransactionDriver, ...args: any[]) => Promise<R>;

export default Transaction;
