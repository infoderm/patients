import type Args from '../Args';
import Context from './Context';

type Executor<C extends Context, A extends Args, R> = (this: C, ...args: A) => Promise<R> | R;

export default Executor;
