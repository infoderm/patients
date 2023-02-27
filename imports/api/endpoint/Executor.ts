import type Args from '../Args';

type Executor<A extends Args, R> = (...args: A) => Promise<R> | R;

export default Executor;
