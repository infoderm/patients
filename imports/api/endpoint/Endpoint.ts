import Options from './Options';
import Executor from './Executor';
import Validator from './Validator';
import Transaction from './Transaction';
import Authentication from './Authentication';

interface Endpoint<T> {
	readonly name: string;
	readonly authentication: Authentication;
	readonly validate: Validator;
	readonly transaction?: Transaction;
	readonly run: Executor;
	readonly options?: Options<T>;
}

export default Endpoint;
