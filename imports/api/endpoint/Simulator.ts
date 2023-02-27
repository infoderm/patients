import type Arg from './Arg';

type Simulator<A extends Arg[]> = (
	...args: A
) => Promise<undefined> | undefined;

export default Simulator;
