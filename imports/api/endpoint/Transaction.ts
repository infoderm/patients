import type TransactionDriver from '../transaction/TransactionDriver';

import type Arg from './Arg';

type Transaction<A extends Arg[], R> = (
	db: TransactionDriver,
	...args: A
) => Promise<R>;

export default Transaction;
