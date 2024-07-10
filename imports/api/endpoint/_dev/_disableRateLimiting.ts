import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';

import isTest from '../../../app/isTest';

if (Meteor.isServer && isTest()) {
	// @ts-expect-error Missing from type definitions.
	Accounts.removeDefaultRateLimit();
}
