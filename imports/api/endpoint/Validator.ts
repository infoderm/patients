import type Args from '../Args';

import {type Context} from './Context';

type Validator<C extends Context, A extends Args> = (
	this: C,
	...args: A
) => void;

export default Validator;
