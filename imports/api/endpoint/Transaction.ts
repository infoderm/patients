import type TransactionDriver from '../transaction/TransactionDriver';

import type Args from '../Args';
import Context from './Context';

type Transaction<C extends Context, A extends Args, R> = (
	this: C,
	db: TransactionDriver,
	...args: A
) => Promise<R>;

export default Transaction;
