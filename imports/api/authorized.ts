import {
	type Authentication,
	AuthenticationDangerousNone,
	AuthenticationLoggedIn,
} from './Authentication';
import {type Context} from './endpoint/Context';

const authorized = (
	authentication: Authentication,
	invocation: Partial<Context>,
): boolean => {
	switch (authentication) {
		case AuthenticationLoggedIn: {
			return typeof invocation.userId === 'string' && invocation.userId !== '';
		}

		case AuthenticationDangerousNone: {
			return true;
		}

		default: {
			return false;
		}
	}
};

export default authorized;
