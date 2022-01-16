import Executor from './Executor';
import Options from './Options';
import Transaction from './Transaction';
import Validator from './Validator';

interface ParamsCommon<T> {
	readonly testOnly?: boolean;
	readonly name: string;
	readonly validate: Validator;
	readonly options?: Options<T>;
}

interface ParamsWithTransaction<T> extends ParamsCommon<T> {
	readonly transaction?: Transaction;
	readonly simulate?: Executor;
	readonly run?: never;
}

interface ParamsWithoutTransaction<T> extends ParamsCommon<T> {
	readonly transaction?: never;
	readonly simulate?: Executor;
	readonly run?: Executor;
}

type Params<T> = ParamsWithTransaction<T> | ParamsWithoutTransaction<T>;

export default Params;
