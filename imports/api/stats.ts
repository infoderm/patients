import {type Subscription} from 'meteor/meteor';

import schema from '../lib/schema';
import type Optional from '../lib/types/Optional';
import {countCollection, type PollResult} from './collection/stats';
import define from './publication/define';
import type Collection from './Collection';
import {AuthenticationLoggedIn} from './Authentication';
import type Filter from './transaction/Filter';
import type Selector from './Selector';

export const countPublicationName = <T, U = T>(
	QueriedCollection: Collection<T, U>,
	{values}: {values: string[]},
) =>
	// @ts-expect-error Accessing private property Collection._name.
	`${countCollection}.${QueriedCollection._name}-${values.join('/')}`;

export const countPublicationKey = <T, U = T>(
	QueriedCollection: Collection<T, U>,
	{values}: {values: string[]},
	query?: Filter<T> | null,
) =>
	// @ts-expect-error Accessing private property Collection._name.
	`${QueriedCollection._name}-${values.join('/')}-${JSON.stringify(
		query ?? {},
	)}`;

type CountOptions<T> = {
	fields: string[];
	discretize: (x: T) => Iterable<[string, string | number]>;
	values: string[];
};

type InputCountOptions<T> =
	| string
	| Optional<CountOptions<T>, 'discretize' | 'values'>;

export const getCountOptions = <T>(
	options: InputCountOptions<T>,
): CountOptions<T> =>
	typeof options === 'string'
		? getCountOptions({fields: [options]})
		: {
				discretize: (x) => options.fields.map((key) => [key, x[key]]),
				values: Array.from(options.fields),
				...options,
		  };

const countPublication = <T, U = T>(
	QueriedCollection: Collection<T, U>,
	{fields, discretize, values}: CountOptions<T>,
) =>
	function (this: Subscription, filter: Filter<T> | null) {
		const collection = countCollection;
		const key = countPublicationKey(QueriedCollection, {values}, filter);
		const selector = {...filter, owner: this.userId} as Selector<T>;
		const options = {
			fields: Object.fromEntries(fields.map((field) => [field, 1])),
		};

		let total = 0;
		const count = {};

		const state = (): PollResult<any> => ({
			total,
			count,
		});

		const refs = new Map();

		const inc = (object) => {
			let current = count;
			for (const [key, value] of discretize(object)) {
				if (key === values[values.length - 1]) {
					if (value in current) (current[value] as number) += 1;
					else current[value] = 1;
				} else {
					if (!(value in current)) current[value] = {};
					current = current[value];
				}
			}
		};

		const dec = (object) => {
			let current = count;
			for (const [key, value] of discretize(object)) {
				if (key === values[values.length - 1]) {
					current[value] -= 1;
				} else {
					current = current[value];
				}
			}
		};

		let initializing = true;
		const handle = QueriedCollection.find(selector, options).observeChanges({
			added: (_id, object) => {
				total += 1;
				inc(object);
				refs.set(_id, {...object});
				if (!initializing) {
					this.changed(collection, key, state());
				}
			},

			changed: (_id, changes) => {
				const previousObject = refs.get(_id);
				dec(previousObject);
				const newObject = {...previousObject, ...changes};
				inc(newObject);
				refs.set(_id, newObject);
				this.changed(collection, key, state());
			},

			removed: (_id) => {
				total -= 1;
				const previousObject = refs.get(_id);
				dec(previousObject);
				refs.delete(_id);
				this.changed(collection, key, state());
			},
		});

		// Instead, we'll send one `added` message right after `observeChanges` has
		// returned, and mark the subscription as ready.
		initializing = false;
		this.added(collection, key, state());
		this.ready();

		// Stop observing the cursor when the client unsubscribes. Stopping a
		// subscription automatically takes care of sending the client any `removed`
		// messages.
		this.onStop(() => {
			handle.stop();
		});
	};

export const publishCount = <T, U = T>(
	QueriedCollection: Collection<T, U>,
	inputOptions: InputCountOptions<T>,
) => {
	const options = getCountOptions(inputOptions);
	return define({
		name: countPublicationName(QueriedCollection, options),
		authentication: AuthenticationLoggedIn,
		schema: schema.tuple([
			schema
				.object({
					/* TODO */
				})
				.nullable(),
		]),
		handle: countPublication(QueriedCollection, options),
	});
};
