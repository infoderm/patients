import type Authentication from './Authentication';
import type Context from './endpoint/Context';

const authorized = (
	authentication: Authentication,
	invocation: Partial<Context>,
): boolean => {
	switch (authentication) {
		case 'DANGEROUS-NONE': {
			return true;
		}

		case 'logged-in': {
			return typeof invocation.userId === 'string' && invocation.userId !== '';
		}

		default: {
			return false;
		}
	}
};

export default authorized;
