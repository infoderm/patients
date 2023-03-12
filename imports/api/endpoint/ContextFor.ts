import Authentication, {AuthenticationDangerousNone, AuthenticationLoggedIn} from "../Authentication";
import {AuthenticatedContext, UnauthenticatedContext} from "./Context";

type ContextFor<A extends Authentication> =
	A extends AuthenticationDangerousNone
		? UnauthenticatedContext
		: A extends AuthenticationLoggedIn
			? AuthenticatedContext
				: never;

export default ContextFor;
