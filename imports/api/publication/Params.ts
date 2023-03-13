import type Args from '../Args';
import {type Authentication} from '../Authentication';

import type Cursor from './Cursor';
import type ContextFor from './ContextFor';

type Params<
	A extends Args,
	T,
	U = T,
	Auth extends Authentication = Authentication,
	C extends ContextFor<Auth> = ContextFor<Auth>,
> = {
	readonly name: string;
	readonly authentication: Auth;
} & (
	| {readonly cursor: (this: C, ...args: A) => Cursor<T, U>}
	| {readonly cursors: (this: C, ...args: A) => Array<Cursor<T, U>>}
	| {readonly handle: (this: C, ...args: A) => void}
);

export default Params;
