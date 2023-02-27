import type Args from '../Args';

type Validator<A extends Args> = (...args: A) => void;

export default Validator;
