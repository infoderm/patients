import type MongoTransactionExecutionDriver from './MongoTransactionExecutionDriver';

type Transaction<R> = (db: MongoTransactionExecutionDriver) => Promise<R>;
export default Transaction;
