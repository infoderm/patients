import isTest from '../app/isTest';

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

		// @ts-expect-error We allow a fallthrough here so that this gets pruned in
		// production build.
		case AuthenticationDangerousNone: {
			if (isTest()) {
				return true;
			}
		}

		// eslint-disable-next-line no-fallthrough
		default: {
			return false;
		}
	}
};

export default authorized;
