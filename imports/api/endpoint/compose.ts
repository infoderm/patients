import {Meteor} from 'meteor/meteor';
import TransactionDriver from '../transaction/TransactionDriver';
import Endpoint from './Endpoint';

const compose = <T>(
	db: TransactionDriver,
	endpoint: Endpoint<T>,
	invocation: Partial<Meteor.MethodThisType>,
	args: any[],
) => {
	Reflect.apply(endpoint.validate, invocation, args);
	if (!endpoint.transaction) {
		throw new Error(
			`Endpoint "${endpoint.name}"'s definition lacks a transaction and thus cannot be part of a composition.`,
		);
	}

	return Reflect.apply(endpoint.transaction, invocation, [db, ...args]);
};

export default compose;
