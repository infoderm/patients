import type Authentication from '../Authentication';
import type Options from './Options';
import type Executor from './Executor';
import type Validator from './Validator';
import type Transaction from './Transaction';
import type Simulator from './Simulator';

type Endpoint<R> = {
	readonly name: string;
	readonly authentication: Authentication;
	readonly validate: Validator;
	readonly transaction?: Transaction<R>;
	readonly run: Executor<R> | Simulator;
	readonly options?: Options<R>;
};

export default Endpoint;
