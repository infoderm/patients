import {Meteor} from 'meteor/meteor';
import MeteorTransactionSimulationDriver from '../transaction/MeteorTransactionSimulationDriver';
import executeTransaction from '../transaction/executeTransaction';
import type Args from '../Args';
import type Params from './Params';
import type Endpoint from './Endpoint';
import invoke from './invoke';
import type Transaction from './Transaction';
import type Executor from './Executor';
import type Simulator from './Simulator';

const define = <A extends Args, R>(params: Params<A, R>): Endpoint<A, R> => {
	const {
		testOnly,
		authentication,
		name,
		validate,
		run,
		simulate,
		transaction,
		options,
	} = params;
	const executor =
		(Meteor.isServer ? run : simulate ?? run) ?? wrapTransaction(transaction);

	const endpoint: Endpoint<A, R> = {
		name,
		authentication: authentication ?? 'logged-in',
		validate,
		transaction,
		run: executor,
		options: simulate ? {returnStubValue: false, ...options} : options,
	};

	if (testOnly) {
		if (!Meteor.isTest && !Meteor.isAppTest) {
			// NOTE Do not publish endpoint if not testing.
			return endpoint;
		}

		console.warn(`Publishing test-only method '${params.name}'.`);
	}

	Meteor.methods({
		async [params.name](...args: any[]) {
			return invoke(endpoint, this, args as A);
		},
	});

	return endpoint;
};

export default define;

const wrapTransactionServer = <A extends Args, R>(
	txn: Transaction<A, R>,
): Executor<A, R> => {
	return async function (...args: A) {
		return executeTransaction(async (db) =>
			Reflect.apply(txn, this, [db, ...args]),
		);
	};
};

const wrapTransactionClient = <A extends Args, R>(
	txn: Transaction<A, R>,
): Simulator<A> => {
	const db = new MeteorTransactionSimulationDriver();
	return async function (...args: A) {
		await Reflect.apply(txn, this, [db, ...args]);
		return undefined;
	};
};

const wrapTransaction = <A extends Args, R>(
	txn: Transaction<A, R>,
): Executor<A, R> | Simulator<A> => {
	return Meteor.isServer
		? wrapTransactionServer(txn)
		: wrapTransactionClient(txn);
};
