import type Args from '../Args';
import {type Context} from './Context';

type Simulator<C extends Context, A extends Args> = (
	this: C,
	...args: A
) => Promise<undefined> | undefined;

export default Simulator;
