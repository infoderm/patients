import type TransactionDriver from '../transaction/TransactionDriver';
import {type Authentication} from '../Authentication';
import type Serializable from '../Serializable';

import type Args from '../Args';
import type ContextFor from './ContextFor';
import type Endpoint from './Endpoint';
import EndpointError from './EndpointError';

const compose = async <
	A extends Args,
	R extends Serializable,
	Auth extends Authentication,
	C extends ContextFor<Auth>,
>(
	db: TransactionDriver,
	endpoint: Endpoint<A, R, Auth, C>,
	invocation: C,
	args: A,
) => {
	// TODO will need to check authorized here if we ever compose endpoints
	// with different authorization levels

	try {
		endpoint.schema.parse(args);
	} catch (error: unknown) {
		console.debug({error});
		throw new EndpointError('schema validation of endpoint args failed');
	}

	if (endpoint.validate) {
		Reflect.apply(endpoint.validate, invocation, args);
	}

	if (!endpoint.transaction) {
		throw new Error(
			`Endpoint "${endpoint.name}"'s definition lacks a transaction and thus cannot be part of a composition.`,
		);
	}

	return Reflect.apply(endpoint.transaction, invocation, [db, ...args]);
};

export default compose;
