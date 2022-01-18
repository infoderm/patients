import MongoDBClientSessionWrapper from './ClientSessionWrapper';

type Transaction = (db: MongoDBClientSessionWrapper) => Promise<any>;
export default Transaction;
