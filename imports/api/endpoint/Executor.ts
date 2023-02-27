import type Arg from './Arg';

type Executor<A extends Arg[], R> = (...args: A) => Promise<R> | R;

export default Executor;
