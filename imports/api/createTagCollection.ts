import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

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
import type Collection from './Collection';
import type Selector from './Selector';
import type Options from './Options';

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

export const names = (rawDisplayName: string): TagNameFields => {
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

type TagCollectionOptions<T, P> = {
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
		Collection,
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

	const Stats = new Mongo.Collection<TagStats>(stats);

	const TagsCache = new Mongo.Collection<CacheItem<T>>(cacheCollection);

	const _publication = definePublication({
		name: publication,
		cursor: pageQuery(Collection),
	});

	const useTags = makeQuery(Collection, _publication);
	const useCachedTag = makeCachedFindOne(Collection, _publication);

	const _cachePublication = definePublication({
		name: cachePublication,
		handle: makeObservedQueryPublication(Collection, cacheCollection),
	});

	// TODO rename to useObservedTags
	const useTagsFind = makeObservedQueryHook(TagsCache, _cachePublication);

	const _singlePublication = definePublication({
		name: singlePublication,
		cursor(name: string) {
			return Collection.find({
				owner: this.userId,
				name,
			} as Mongo.Selector<T>);
		},
	});

	const useTag = makeItem(Collection, _singlePublication);

	const useTaggedDocuments = (name: string, options) => {
		const selector = {[key]: {$elemMatch: {name}}} as Mongo.Selector<P>;

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
		handle(name: string) {
			check(name, String);
			const uid = JSON.stringify({name, owner: this.userId});
			const query = {
				[key]: {$elemMatch: {name}},
				owner: this.userId,
			} as Mongo.Selector<P>;
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
		validate(tagId: string, newname: string) {
			check(tagId, String);
			check(newname, String);
		},
		async transaction(
			db: TransactionDriver,
			tagId: string,
			rawDisplayName: string,
		) {
			const owner = this.userId;
			const tag = await db.findOne(Collection, {
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
				});

				if (problem !== null) {
					throw new Error(
						// eslint-disable-next-line @typescript-eslint/no-base-to-string
						`Cannot rename ${key} from ${oldname} to ${newname} because parent ${problem._id} already has both.`,
					);
				}
			}

			await db.updateMany(
				Parent,
				{[key]: {$elemMatch: {name: oldname}}, owner},
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

			await db.deleteOne(Collection, {_id} as Filter<T>);
			return db.updateOne(
				Collection,
				selector as Filter<T>,
				{$set: newFields} as unknown as Mongo.Modifier<T>,
				{upsert: true},
			);
		},
		simulate(_tagId: string, _newname: string) {
			return undefined;
		},
	});

	const deleteEndpoint = defineEndpoint({
		name: `${collection}.delete`,
		validate(tagId: string) {
			check(tagId, String);
		},
		async transaction(db: TransactionDriver, tagId: string) {
			const owner = this.userId;
			const tag = await db.findOne(Collection, {
				_id: tagId,
				owner,
			} as Filter<T>);

			if (tag === null) {
				throw new Meteor.Error('not-found');
			}

			await db.updateMany(
				Parent,
				{[key]: {$elemMatch: {name: tag.name}}, owner},
				{$pull: {[key]: {name: tag.name}}},
			);

			return db.deleteOne(Collection, {_id: tagId} as Filter<T>);
		},
		simulate(_tagId: string) {
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
				Collection,
				selector as Filter<T>,
				{$set: fields} as Mongo.Modifier<T>,
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

			return db.deleteOne(Collection, selector);
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
