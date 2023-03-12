import type Args from '../Args';
import Context from './Context';

type Validator<C extends Context, A extends Args> = (this: C, ...args: A) => void;

export default Validator;
