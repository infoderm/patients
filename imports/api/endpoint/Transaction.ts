import type TransactionDriver from '../transaction/TransactionDriver';

import type Args from '../Args';

type Transaction<A extends Args, R> = (
	db: TransactionDriver,
	...args: A
) => Promise<R>;

export default Transaction;
