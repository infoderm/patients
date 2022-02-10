import Authentication from '../Authentication';
import Executor from './Executor';
import Options from './Options';
import Simulator from './Simulator';
import Transaction from './Transaction';
import Validator from './Validator';

interface ParamsCommon<R> {
	readonly testOnly?: boolean;
	readonly authentication?: Authentication;
	readonly name: string;
	readonly validate: Validator;
	readonly options?: Options<R>;
}

interface ParamsWithTransaction<R> extends ParamsCommon<R> {
	readonly transaction: Transaction<R>;
	readonly simulate?: Simulator;
	readonly run?: never;
}

interface ParamsWithoutTransaction<R> extends ParamsCommon<R> {
	readonly transaction?: never;
	readonly simulate?: Simulator;
	readonly run: Executor<R>;
}

type Params<R> = ParamsWithTransaction<R> | ParamsWithoutTransaction<R>;

export default Params;
