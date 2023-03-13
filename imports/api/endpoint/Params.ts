import type Args from '../Args';
import type Serializable from '../Serializable';
import {type Authentication} from '../Authentication';
import type Executor from './Executor';
import type Options from './Options';
import type Simulator from './Simulator';
import type Transaction from './Transaction';
import type Validator from './Validator';
import {type Context} from './Context';
import type ContextFor from './ContextFor';

type ParamsCommon<C extends Context, A extends Args, R extends Serializable> = {
	readonly testOnly?: boolean;
	readonly name: string;
	readonly validate: Validator<C, A>;
	readonly options?: Options<R>;
};

type ParamsWithTransaction<
	C extends Context,
	A extends Args,
	R extends Serializable,
> = {
	readonly transaction: Transaction<C, A, R>;
	readonly simulate?: Simulator<C, A>;
	readonly run?: never;
} & ParamsCommon<C, A, R>;

type ParamsWithoutTransaction<
	C extends Context,
	A extends Args,
	R extends Serializable,
> = {
	readonly transaction?: never;
	readonly simulate?: Simulator<C, A>;
	readonly run: Executor<C, A, R>;
} & ParamsCommon<C, A, R>;

type Params<
	A extends Args,
	R extends Serializable,
	Auth extends Authentication = Authentication,
> = {
	readonly authentication: Auth;
} & (
	| ParamsWithTransaction<ContextFor<Auth>, A, R>
	| ParamsWithoutTransaction<ContextFor<Auth>, A, R>
);

export default Params;
