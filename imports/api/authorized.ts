import {Meteor} from 'meteor/meteor';
import Authentication from './Authentication';

const authorized = (
	authentication: Authentication,
	invocation: Partial<Meteor.MethodThisType>,
): boolean => {
	switch (authentication) {
		case 'DANGEROUS-NONE':
			return true;
		case 'logged-in':
			return typeof invocation.userId === 'string' && invocation.userId !== '';
		default:
			return false;
	}
};

export default authorized;
