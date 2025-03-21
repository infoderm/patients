import {Meteor} from 'meteor/meteor';

import isTest from '../../app/isTest';

import MeteorTransactionSimulationDriver from '../transaction/MeteorTransactionSimulationDriver';
import executeTransaction from '../transaction/executeTransaction';

import type Args from '../Args';
import type Serializable from '../Serializable';
import {type Authentication} from '../Authentication';
import type ArgsSchema from '../ArgsSchema';
import type InferArgs from '../InferArgs';

import isNonAppTest from '../../app/isNonAppTest';

import type Params from './Params';
import type Endpoint from './Endpoint';
import invoke from './invoke';
import type Transaction from './Transaction';
import type Executor from './Executor';
import type Simulator from './Simulator';
import {type Context} from './Context';
import type ContextFor from './ContextFor';

let isServerRegistrationOpen = false;

export const openServerRegistration = () => {
	isServerRegistrationOpen = true;
};

export const closeServerRegistration = () => {
	isServerRegistrationOpen = false;
};

const define = <
	S extends ArgsSchema,
	R extends Serializable,
	Auth extends Authentication = Authentication,
>({
	testOnly,
	authentication,
	name,
	schema,
	validate,
	run,
	simulate,
	transaction,
	options,
}: Params<S, R, Auth>): Endpoint<InferArgs<S>, R, Auth> => {
	const executor =
		(Meteor.isServer ? run : simulate ?? run) ?? wrapTransaction(transaction!);

	const endpoint: Endpoint<InferArgs<S>, R, Auth> = {
		name,
		schema,
		authentication,
		validate,
		transaction,
		run: executor,
		options: simulate ? {returnStubValue: false, ...options} : options,
	};

	if (testOnly && !isTest()) {
		// NOTE Do not publish endpoint if not testing.
		return endpoint;
	}

	if (
		Meteor.isClient ||
		(Meteor.isServer &&
			(isServerRegistrationOpen || isNonAppTest() || testOnly))
	) {
		if (testOnly) {
			console.warn(`Publishing test-only method '${name}'.`);
		}

		Meteor.methods({
			async [name](...args: any[]) {
				return invoke(
					endpoint,
					this as unknown as ContextFor<Auth>,
					args as InferArgs<S>,
				);
			},
		});
	}

	return endpoint;
};

export default define;

const wrapTransactionServer = <
	C extends Context,
	A extends Args,
	R extends Serializable,
>(
	txn: Transaction<C, A, R>,
): Executor<C, A, R> => {
	return async function (...args: A) {
		return executeTransaction(async (db) =>
			Reflect.apply(txn, this, [db, ...args]),
		);
	};
};

const wrapTransactionClient = <
	C extends Context,
	A extends Args,
	R extends Serializable,
>(
	txn: Transaction<C, A, R>,
): Simulator<C, A> => {
	const db = new MeteorTransactionSimulationDriver();
	return async function (...args: A) {
		await Reflect.apply(txn, this, [db, ...args]);
		return undefined;
	};
};

const wrapTransaction = <
	C extends Context,
	A extends Args,
	R extends Serializable,
>(
	txn: Transaction<C, A, R>,
): Executor<C, A, R> | Simulator<C, A> => {
	return Meteor.isServer
		? wrapTransactionServer(txn)
		: wrapTransactionClient(txn);
};
