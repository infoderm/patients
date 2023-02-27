import type Args from '../Args';
import type Authentication from '../Authentication';

import type Cursor from './Cursor';
import type Subscription from './Subscription';

type Params<A extends Args, T, U = T> = {
	readonly name: string;
	readonly authentication?: Authentication;
	readonly cursor?: (this: Subscription, ...args: A) => Cursor<T, U>;
	readonly cursors?: (
		this: Subscription,
		...args: A
	) => Array<Mongo.Cursor<T, U>>;
	readonly handle?: (this: Subscription, ...args: A) => void;
};

export default Params;
