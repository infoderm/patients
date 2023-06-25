import type TransactionDriver from '../transaction/TransactionDriver';

import type Args from '../Args';
import type Serializable from '../Serializable';

import {type Context} from './Context';

type Transaction<C extends Context, A extends Args, R extends Serializable> = (
	this: C,
	db: TransactionDriver,
	...args: A
) => Promise<R>;

export default Transaction;
