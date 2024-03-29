import type Serializable from '../Serializable';
import type Args from '../Args';
import {type Authentication} from '../Authentication';
import type ArgsSchemaFor from '../ArgsSchemaFor';

import type Options from './Options';
import type Executor from './Executor';
import type Validator from './Validator';
import type Transaction from './Transaction';
import type Simulator from './Simulator';
import type ContextFor from './ContextFor';

type Endpoint<
	A extends Args,
	R extends Serializable,
	Auth extends Authentication = Authentication,
	C extends ContextFor<Auth> = ContextFor<Auth>,
	S extends ArgsSchemaFor<A> = ArgsSchemaFor<A>,
> = {
	readonly name: string;
	readonly schema: S;
	readonly options?: Options<R>;
	readonly authentication: Auth;
	readonly validate?: Validator<C, A>;
	readonly transaction?: Transaction<C, A, R>;
	readonly run: Executor<C, A, R> | Simulator<C, A>;
};

export default Endpoint;
