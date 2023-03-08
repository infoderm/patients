import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

import schema from '../lib/schema';
import mergeOptions from './query/mergeOptions';

import makeQuery from './makeQuery';
import makeObservedQueryHook from './makeObservedQueryHook';
import makeCachedFindOne from './makeCachedFindOne';
import makeObservedQueryPublication from './makeObservedQueryPublication';
import pageQuery from './pageQuery';

import defineEndpoint from './endpoint/define';
import definePublication from './publication/define';
import useCursor from './publication/useCursor';
import useItem from './publication/useItem';
import useSubscription from './publication/useSubscription';

import {
	containsNonAlphabetical,
	formattedLine,
	type NormalizedLine,
	normalizedLine,
} from './string';

import type CacheItem from './CacheItem';
import {type TagComputedFields, type TagNameFields} from './tags/TagDocument';
import type TagDocument from './tags/TagDocument';
import makeItem from './tags/makeItem';
import type Publication from './publication/Publication';
import type TransactionDriver from './transaction/TransactionDriver';
import type Filter from './transaction/Filter';
import Collection from './Collection';
import type Selector from './Selector';
import type Options from './Options';
import type Modifier from './Modifier';
import {AuthenticationLoggedIn} from './Authentication';

export const STATS_SUFFIX = '.stats';
export const FIND_CACHE_SUFFIX = '.find.cache';
export const FIND_OBSERVE_SUFFIX = '.find.observe';

const sanitize = (
	rawDisplayName: string,
): TagNameFields & TagComputedFields => {
	const {displayName, name} = names(rawDisplayName);
	return {
		displayName,
		name,
		...computedFields(displayName),
	};
};

export const names = (rawDisplayName: string) => {
	const displayName = formattedLine(rawDisplayName);
	const name = normalizedLine(displayName);
	return {
		displayName,
		name,
	};
};

const computedFields = (displayName: string): TagComputedFields => {
	return {
		containsNonAlphabetical: containsNonAlphabetical(displayName),
	};
};

type TagCollectionOptions<
	T extends TagDocument,
	P extends {[key: string]: any; owner: string},
> = {
	Collection: Collection<T>;
	collection: string;
	publication: string;
	singlePublication: string;
	Parent: Collection<P>;
	parentPublication: Publication<[Selector<P>, Options<P>]>;
	key: string;
};

type TagStats = {
	count: number;
};

const createTagCollection = <
	T extends TagDocument,
	P extends {[key: string]: any; owner: string},
>(
	options: TagCollectionOptions<T, P>,
) => {
	const {
		Collection: tagsCollection,
		collection,
		publication,
		singlePublication,
		Parent,
		parentPublication,
		key,
	} = options;

	const stats = collection + STATS_SUFFIX;
	const statsPublication = stats;

	const cacheCollection = collection + FIND_CACHE_SUFFIX;
	const cachePublication = collection + FIND_OBSERVE_SUFFIX;

	const Stats = new Collection<TagStats>(stats);

	const TagsCache = new Collection<CacheItem<T>>(cacheCollection);

	const _publication = definePublication({
		name: publication,
		authentication: AuthenticationLoggedIn,
		cursor: pageQuery(tagsCollection),
	});

	const useTags = makeQuery(tagsCollection, _publication);
	const useCachedTag = makeCachedFindOne(tagsCollection, _publication);

	const _cachePublication = definePublication({
		name: cachePublication,
		authentication: AuthenticationLoggedIn,
		handle: makeObservedQueryPublication(tagsCollection, cacheCollection),
	});

	// TODO rename to useObservedTags
	const useTagsFind = makeObservedQueryHook(TagsCache, _cachePublication);

	const _singlePublication = definePublication({
		name: singlePublication,
		authentication: AuthenticationLoggedIn,
		cursor(name: string) {
			return tagsCollection.find({
				owner: this.userId,
				name,
			} as Selector<T>);
		},
	});

	const useTag = makeItem(tagsCollection, _singlePublication);

	const useTaggedDocuments = (name: string, options) => {
		const selector = {[key]: {$elemMatch: {name}}} as Selector<P>;

		const mergedOptions = mergeOptions(options, {
			fields: {
				[key]: 1,
			},
		});

		const isLoading = useSubscription(
			parentPublication,
			selector,
			mergedOptions,
		);
		const loading = isLoading();

		const results = useCursor(
			() => Parent.find(selector, options),
			[name, JSON.stringify(options)],
		);

		return {
			loading,
			results,
		};
	};

	// Publish the current size of a collection.
	const _statsPublication = definePublication({
		name: statsPublication,
		authentication: AuthenticationLoggedIn,
		handle(name: string) {
			check(name, String);
			const uid = JSON.stringify({name, owner: this.userId});
			const query = {
				[key]: {$elemMatch: {name}},
				owner: this.userId,
			} as Selector<P>;
			// We only include relevant fields
			const options = {fields: {_id: 1, [key]: 1}};

			let count = 0;
			let initializing = true;

			// `observeChanges` only returns after the initial `added` callbacks have run.
			// Until then, we don't want to send a lot of `changed` messages—hence
			// tracking the `initializing` state.
			const handle = Parent.find(query, options).observeChanges({
				added: () => {
					count += 1;

					if (!initializing) {
						this.changed(stats, uid, {count});
					}
				},

				removed: () => {
					count -= 1;
					this.changed(stats, uid, {count});
				},

				// We don't care about `changed` events.
			});

			// Instead, we'll send one `added` message right after `observeChanges` has
			// returned, and mark the subscription as ready.
			initializing = false;
			this.added(stats, uid, {name, count});
			this.ready();

			// Stop observing the cursor when the client unsubscribes. Stopping a
			// subscription automatically takes care of sending the client any `removed`
			// messages.
			this.onStop(() => {
				handle.stop();
			});
		},
	});

	const useTagStats = (name) => {
		const isLoading = useSubscription(_statsPublication, name);
		const loading = isLoading();

		const result = useItem(Stats, {name}, undefined, [name]);

		return {
			loading,
			result,
		};
	};

	const renameEndpoint = defineEndpoint({
		name: `${collection}.rename`,
		authentication: AuthenticationLoggedIn,
		schema: schema.tuple([schema.string(), schema.string()]),
		async transaction(db: TransactionDriver, tagId, rawDisplayName) {
			const owner = this.userId;
			const tag = await db.findOne(tagsCollection, {
				_id: tagId,
				owner,
			} as Filter<T>);

			if (tag === null) {
				throw new Meteor.Error('not-found');
			}

			const {_id, ...oldFields} = tag;

			const newFields = {
				...oldFields,
				...sanitize(rawDisplayName),
			};

			const oldname = oldFields.name;

			const {displayName: newDisplayName, name: newname} = newFields;

			if (newname !== oldname) {
				const problem = await db.findOne(Parent, {
					[key]: {
						$all: [
							{$elemMatch: {name: oldname}},
							{$elemMatch: {name: newname}},
						],
					},
					owner,
				} as Filter<P>);

				if (problem !== null) {
					throw new Error(
						// eslint-disable-next-line @typescript-eslint/no-base-to-string
						`Cannot rename ${key} from ${oldname} to ${newname} because parent ${problem._id} already has both.`,
					);
				}
			}

			await db.updateMany(
				Parent,
				{[key]: {$elemMatch: {name: oldname}}, owner} as Filter<P>,
				{
					$set: {
						[`${key}.$[old].name`]: newname,
						[`${key}.$[old].displayName`]: newDisplayName,
					},
				},
				{arrayFilters: [{'old.name': oldname}]},
			);

			const selector = {
				owner,
				name: newname,
			};

			await db.deleteOne(tagsCollection, {_id} as Filter<T>);
			return db.updateOne(
				tagsCollection,
				selector as Filter<T>,
				{$set: newFields} as unknown as Modifier<T>,
				{upsert: true},
			);
		},
		simulate(_tagId, _newname) {
			return undefined;
		},
	});

	const deleteEndpoint = defineEndpoint({
		name: `${collection}.delete`,
		authentication: AuthenticationLoggedIn,
		schema: schema.tuple([schema.string()]),
		async transaction(db: TransactionDriver, tagId) {
			const owner = this.userId;
			const tag = await db.findOne(tagsCollection, {
				_id: tagId,
				owner,
			} as Filter<T>);

			if (tag === null) {
				throw new Meteor.Error('not-found');
			}

			await db.updateMany(
				Parent,
				{[key]: {$elemMatch: {name: tag.name}}, owner} as Filter<P>,
				{$pull: {[key]: {name: tag.name}}},
			);

			return db.deleteOne(tagsCollection, {_id: tagId} as Filter<T>);
		},
		simulate(_tagId) {
			return undefined;
		},
	});

	const operations = {
		options: {
			...options,
			stats,
			parentPublicationStats: statsPublication,
		},

		async add(db: TransactionDriver, owner: string, rawDisplayName: string) {
			check(owner, String);
			check(rawDisplayName, String);

			const fields = {
				...sanitize(rawDisplayName),
				owner,
			};

			const selector = {
				owner,
				name: fields.name,
			};

			return db.updateOne(
				tagsCollection,
				selector as Filter<T>,
				{$set: fields} as Modifier<T>,
				{upsert: true},
			);
		},

		async remove(db: TransactionDriver, owner: string, name: NormalizedLine) {
			check(owner, String);
			check(name, String);

			const selector = {
				owner,
				name,
			} as Filter<T>;

			return db.deleteOne(tagsCollection, selector);
		},
	};

	return {
		operations,
		useTags,
		useTagsFind,
		useTagStats,
		useTag,
		useCachedTag,
		useTaggedDocuments,
		renameEndpoint,
		deleteEndpoint,
	};
};

export default createTagCollection;
