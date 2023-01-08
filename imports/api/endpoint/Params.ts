import type Authentication from '../Authentication';
import type Executor from './Executor';
import type Options from './Options';
import type Simulator from './Simulator';
import type Transaction from './Transaction';
import type Validator from './Validator';

type ParamsCommon<R> = {
	readonly testOnly?: boolean;
	readonly authentication?: Authentication;
	readonly name: string;
	readonly validate: Validator;
	readonly options?: Options<R>;
};

type ParamsWithTransaction<R> = {
	readonly transaction: Transaction<R>;
	readonly simulate?: Simulator;
	readonly run?: never;
} & ParamsCommon<R>;

type ParamsWithoutTransaction<R> = {
	readonly transaction?: never;
	readonly simulate?: Simulator;
	readonly run: Executor<R>;
} & ParamsCommon<R>;

type Params<R> = ParamsWithTransaction<R> | ParamsWithoutTransaction<R>;

export default Params;
