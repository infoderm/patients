import type Arg from './Arg';

type Validator<A extends Arg[]> = (...args: A) => void;

export default Validator;
