import Wrapper from '../transaction/Wrapper';

type Transaction = (db: Wrapper, ...args: any[]) => Promise<any>;

export default Transaction;
