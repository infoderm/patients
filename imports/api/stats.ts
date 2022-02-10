import {Subscription} from 'meteor/meteor';

import {countCollection, PollResult} from './collection/stats';
import define from './publication/define';
import Collection from './transaction/Collection';

export const countPublicationName = (QueriedCollection, {values}) =>
	`${countCollection}.${QueriedCollection._name}-${values.join('/')}`;

export const countPublicationKey = (QueriedCollection, {values}, query) =>
	`${QueriedCollection._name}-${values.join('/')}-${JSON.stringify(
		query ?? {},
	)}`;

interface CountOptions {
	fields: string[];
	discretize: (x: object) => Iterable<[string, string | number]>;
	values: string[];
}

export const getCountOptions = (options): CountOptions =>
	typeof options === 'string'
		? getCountOptions({fields: [options]})
		: {
				discretize: (x) => options.fields.map((key) => [key, x[key]]),
				values: Array.from(options.fields),
				...options,
		  };

const countPublication = <T, U = T>(
	QueriedCollection: Collection<T, U>,
	{fields, discretize, values}: CountOptions,
) =>
	function (this: Subscription, query) {
		const collection = countCollection;
		const key = countPublicationKey(QueriedCollection, {values}, query);
		const selector = {...query, owner: this.userId};
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

export const publishCount = (QueriedCollection, options) => {
	options = getCountOptions(options);
	return define({
		name: countPublicationName(QueriedCollection, options),
		handle: countPublication(QueriedCollection, options),
	});
};
