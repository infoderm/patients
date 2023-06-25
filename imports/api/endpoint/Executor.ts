import type Args from '../Args';
import type Serializable from '../Serializable';

import {type Context} from './Context';

type Executor<C extends Context, A extends Args, R extends Serializable> = (
	this: C,
	...args: A
) => Promise<R> | R;

export default Executor;
