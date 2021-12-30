import ClientSessionWrapper from './ClientSessionWrapper';

type Transaction = (txn: ClientSessionWrapper) => Promise<any>;
export default Transaction;
