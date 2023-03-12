import type Args from '../Args';
import type Authentication from '../Authentication';

import type Cursor from './Cursor';
import type ContextFor from './ContextFor';

type Params<A extends Args, T, U = T, Auth extends Authentication = Authentication> = {
	readonly name: string;
	readonly authentication: Auth;
} & (
	| {readonly cursor: (this: ContextFor<Auth>, ...args: A) => Cursor<T, U>;}
	| {readonly cursors: (this: ContextFor<Auth>, ...args: A) => Array<Cursor<T, U>>;}
	| {readonly handle: (this: ContextFor<Auth>, ...args: A) => void;}
);

export default Params;
