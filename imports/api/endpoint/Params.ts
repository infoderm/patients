import Authentication from '../Authentication';
import Executor from './Executor';
import Options from './Options';
import Simulator from './Simulator';
import Transaction from './Transaction';
import Validator from './Validator';

interface ParamsCommon<T> {
	readonly testOnly?: boolean;
	readonly authentication?: Authentication;
	readonly name: string;
	readonly validate: Validator;
	readonly options?: Options<T>;
}

interface ParamsWithTransaction<T> extends ParamsCommon<T> {
	readonly transaction: Transaction;
	readonly simulate?: Simulator;
	readonly run?: never;
}

interface ParamsWithoutTransaction<T> extends ParamsCommon<T> {
	readonly transaction?: never;
	readonly simulate?: Simulator;
	readonly run: Executor;
}

type Params<T> = ParamsWithTransaction<T> | ParamsWithoutTransaction<T>;

export default Params;
