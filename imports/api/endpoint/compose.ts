import {type Meteor} from 'meteor/meteor';
import type TransactionDriver from '../transaction/TransactionDriver';
import type Endpoint from './Endpoint';

const compose = async <T>(
	db: TransactionDriver,
	endpoint: Endpoint<T>,
	invocation: Partial<Meteor.MethodThisType>,
	args: any[],
) => {
	// TODO will need to check authorized here if we ever compose endpoints
	// with different authorization levels
	Reflect.apply(endpoint.validate, invocation, args);
	if (!endpoint.transaction) {
		throw new Error(
			`Endpoint "${endpoint.name}"'s definition lacks a transaction and thus cannot be part of a composition.`,
		);
	}

	return Reflect.apply(endpoint.transaction, invocation, [db, ...args]);
};

export default compose;
