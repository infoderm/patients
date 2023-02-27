import type Authentication from '../Authentication';
import type Args from '../Args';
import type Executor from './Executor';
import type Options from './Options';
import type Simulator from './Simulator';
import type Transaction from './Transaction';
import type Validator from './Validator';

type ParamsCommon<A extends Args, R> = {
	readonly testOnly?: boolean;
	readonly authentication?: Authentication;
	readonly name: string;
	readonly validate: Validator<A>;
	readonly options?: Options<R>;
};

type ParamsWithTransaction<A extends Args, R> = {
	readonly transaction: Transaction<A, R>;
	readonly simulate?: Simulator<A>;
	readonly run?: never;
} & ParamsCommon<A, R>;

type ParamsWithoutTransaction<A extends Args, R> = {
	readonly transaction?: never;
	readonly simulate?: Simulator<A>;
	readonly run: Executor<A, R>;
} & ParamsCommon<A, R>;

type Params<A extends Args, R> =
	| ParamsWithTransaction<A, R>
	| ParamsWithoutTransaction<A, R>;

export default Params;
