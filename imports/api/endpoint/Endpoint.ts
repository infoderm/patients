import type Authentication from '../Authentication';
import type Options from './Options';
import type Executor from './Executor';
import type Validator from './Validator';
import type Transaction from './Transaction';
import type Simulator from './Simulator';

type Endpoint<A extends any[], R> = {
	readonly name: string;
	readonly authentication: Authentication;
	readonly validate: Validator<A>;
	readonly transaction?: Transaction<A, R>;
	readonly run: Executor<A, R> | Simulator<A>;
	readonly options?: Options<R>;
};

export default Endpoint;
