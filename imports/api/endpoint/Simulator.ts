import type Args from '../Args';

type Simulator<A extends Args> = (...args: A) => Promise<undefined> | undefined;

export default Simulator;
