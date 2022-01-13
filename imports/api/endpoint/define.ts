import {Meteor} from 'meteor/meteor';
import MeteorTransactionSimulationDriver from '../transaction/MeteorTransactionSimulationDriver';
import executeTransaction from '../transaction/executeTransaction';
import Params from './Params';
import Endpoint from './Endpoint';
import invoke from './invoke';
import Transaction from './Transaction';
import Executor from './Executor';

const define = <T>(params: Params<T>): Endpoint<T> => {
	const {name, validate, run, simulate, transaction, options} = params;
	const executor =
		(Meteor.isServer ? run : simulate) ?? wrapTransaction(transaction);

	const endpoint: Endpoint<T> = {
		name,
		validate,
		transaction,
		run: executor,
		options,
	};

	Meteor.methods({
		[params.name](...args: any[]) {
			return invoke(endpoint, this, args);
		},
	});

	return endpoint;
};

export default define;

const wrapTransactionServer = (txn: Transaction): Executor => {
	return async function (...args: any[]) {
		return executeTransaction(async (db) =>
			Reflect.apply(txn, this, [db, ...args]),
		);
	};
};

const wrapTransactionClient = (txn: Transaction): Executor => {
	const db = new MeteorTransactionSimulationDriver();
	return function (...args: any[]) {
		Reflect.apply(txn, this, [db, ...args]);
	};
};

const wrapTransaction = (txn: Transaction): Executor => {
	return Meteor.isServer
		? wrapTransactionServer(txn)
		: wrapTransactionClient(txn);
};
