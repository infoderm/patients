import schema from '../lib/schema';

import type Collection from './Collection';
import type Document from './Document';
import type Filter from './query/Filter';
import queryToSelectorOptionsPair from './query/queryToSelectorOptionsPair';
import {userQuery} from './query/UserQuery';
import type UserQuery from './query/UserQuery';
import watch from './query/watch';

const observeOptions = schema
	.object({
		added: schema.boolean().optional(),
		removed: schema.boolean().optional(),
		changed: schema.boolean().optional(),
	})
	.strict();

export type ObserveOptions = schema.infer<typeof observeOptions>;

export const publicationSchema = <S extends schema.ZodTypeAny>(tSchema: S) =>
	schema.tuple([
		schema.string(),
		userQuery(tSchema),
		observeOptions.nullable(),
	]);

const makeObservedQueryPublication = <T extends Document, U = T>(
	QueriedCollection: Collection<T, U>,
	observedQueryCacheCollectionName: string,
) =>
	async function (
		key: string,
		query: UserQuery<T>,
		observe: ObserveOptions | null,
	) {
		let [selector, options] = queryToSelectorOptionsPair(query);
		selector = {
			...selector,
			owner: this.userId,
		};
		// const callbacks: ObserveOptions = {
		// added: true,
		// removed: true,
		// ...observe,
		// };
		const uid = JSON.stringify({
			key,
			selector,
			options,
			observe,
		});

		const stop = () => {
			this.stop();
		};

		const handle = await watch<T, U>(
			QueriedCollection,
			selector as Filter<T>,
			options,
			async () => {
				stop();
				// switch (operationType) {
				// case 'replace':
				// case 'update': {
				// if (callbacks.changed) stop();
				// break;
				// }

				// case 'insert': {
				// if (callbacks.added) stop();
				// break;
				// }

				// case 'delete': {
				// if (callbacks.removed) stop();
				// break;
				// }

				// default: {
				// stop();
				// }
				// }
			},
		);

		const results = handle.init;

		this.added(observedQueryCacheCollectionName, uid, {
			key,
			results,
		});
		this.ready();

		// NOTE: Stop observing the cursor when the client unsubscribes.
		this.onStop(async () => {
			await handle.stop();
		});
	};

export default makeObservedQueryPublication;
