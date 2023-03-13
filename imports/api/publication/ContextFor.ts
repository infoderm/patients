import {
	type Authentication,
	type AuthenticationDangerousNone,
	type AuthenticationLoggedIn,
} from '../Authentication';
import {
	type AuthenticatedContext,
	type UnauthenticatedContext,
} from './Context';

type ContextFor<A extends Authentication> =
	A extends AuthenticationDangerousNone
		? UnauthenticatedContext
		: A extends AuthenticationLoggedIn
		? AuthenticatedContext
		: never;

export default ContextFor;
