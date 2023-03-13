import {type Authentication} from '../Authentication';

import type ArgsSchema from '../ArgsSchema';
import type InferArgs from '../InferArgs';
import type Cursor from './Cursor';
import type ContextFor from './ContextFor';

type Params<
	S extends ArgsSchema,
	T,
	U = T,
	Auth extends Authentication = Authentication,
	C extends ContextFor<Auth> = ContextFor<Auth>,
	A extends InferArgs<S> = InferArgs<S>,
> = {
	readonly name: string;
	readonly authentication: Auth;
	readonly schema: S;
} & (
	| {readonly cursor: (this: C, ...args: A) => Cursor<T, U>}
	| {readonly cursors: (this: C, ...args: A) => Array<Cursor<T, U>>}
	| {readonly handle: (this: C, ...args: A) => void}
);

export default Params;
