import {Meteor} from 'meteor/meteor';
import MeteorTransactionSimulationDriver from '../transaction/MeteorTransactionSimulationDriver';
import executeTransaction from '../transaction/executeTransaction';
import type Params from './Params';
import type Endpoint from './Endpoint';
import invoke from './invoke';
import type Transaction from './Transaction';
import type Executor from './Executor';
import type Simulator from './Simulator';

const define = <R>(params: Params<R>): Endpoint<R> => {
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

	const endpoint: Endpoint<R> = {
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
			return invoke(endpoint, this, args);
		},
	});

	return endpoint;
};

export default define;

const wrapTransactionServer = <R>(txn: Transaction<R>): Executor<R> => {
	return async function (...args: any[]) {
		return executeTransaction(async (db) =>
			Reflect.apply(txn, this, [db, ...args]),
		);
	};
};

const wrapTransactionClient = <R>(txn: Transaction<R>): Simulator => {
	const db = new MeteorTransactionSimulationDriver();
	return async function (...args: any[]) {
		await Reflect.apply(txn, this, [db, ...args]);
		return undefined;
	};
};

const wrapTransaction = <R>(txn: Transaction<R>): Executor<R> | Simulator => {
	return Meteor.isServer
		? wrapTransactionServer(txn)
		: wrapTransactionClient(txn);
};
