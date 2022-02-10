import Authentication from '../Authentication';
import Options from './Options';
import Executor from './Executor';
import Validator from './Validator';
import Transaction from './Transaction';
import Simulator from './Simulator';

interface Endpoint<R> {
	readonly name: string;
	readonly authentication: Authentication;
	readonly validate: Validator;
	readonly transaction?: Transaction<R>;
	readonly run: Executor<R> | Simulator;
	readonly options?: Options<R>;
}

export default Endpoint;
