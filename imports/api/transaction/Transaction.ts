import type MongoTransactionExecutionDriver from './MongoTransactionExecutionDriver';

type Transaction = (db: MongoTransactionExecutionDriver) => Promise<any>;
export default Transaction;
