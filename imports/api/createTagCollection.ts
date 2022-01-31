import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {useTracker} from 'meteor/react-meteor-data';

import mergeOptions from '../util/mergeOptions';

import makeQuery from './makeQuery';
import makeObservedQueryHook from './makeObservedQueryHook';
import makeCachedFindOne from './makeCachedFindOne';
import makeObservedQueryPublication from './makeObservedQueryPublication';
import pageQuery from './pageQuery';

import defineEndpoint from './endpoint/define';
import definePublication from './publication/define';

import {containsNonAlphabetical} from './string';

import CacheItem from './CacheItem';
import TagDocument from './tags/TagDocument';
import makeItem from './tags/makeItem';
import subscribe from './publication/subscribe';
import Publication from './publication/Publication';
import TransactionDriver from './transaction/TransactionDriver';
import Filter from './transaction/Filter';

export const STATS_SUFFIX = '.stats';
export const FIND_CACHE_SUFFIX = '.find.cache';
export const FIND_OBSERVE_SUFFIX = '.find.observe';

const computedFields = (name) => ({
	containsNonAlphabetical: containsNonAlphabetical(name),
});

interface Options<T> {
	Collection: Mongo.Collection<T>;
	collection: string;
	publication: string;
	singlePublication: string;
	Parent: Mongo.Collection<any>;
	parentPublication: Publication;
	key: string;
}

interface TagStats {
	count: number;
}

const createTagCollection = <T extends TagDocument>(options: Options<T>) => {
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

	const TagsCache = new Mongo.Collection<CacheItem>(cacheCollection);

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

	const useTaggedDocuments = (name: string, options) =>
		useTracker(() => {
			const selector = {[key]: name};
			const mergedOptions = mergeOptions(options, {
				fields: {
					[key]: 1,
				},
			});
			const handle = subscribe(parentPublication, selector, mergedOptions);
			const loading = !handle.ready();
			return {
				loading,
				results: Parent.find(selector, options).fetch(),
			};
		}, [name, JSON.stringify(options)]);

	// Publish the current size of a collection.
	const _statsPublication = definePublication({
		name: statsPublication,
		handle(name: string) {
			check(name, String);
			const uid = JSON.stringify({name, owner: this.userId});
			const query = {[key]: name, owner: this.userId};
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

	const useTagStats = (name) =>
		useTracker(() => {
			const handle = subscribe(_statsPublication, name);
			const loading = !handle.ready();
			return {
				loading,
				result: Stats.findOne({name}),
			};
		}, [name]);

	const renameEndpoint = defineEndpoint({
		name: `${collection}.rename`,
		validate(tagId: string, newname: string) {
			check(tagId, String);
			check(newname, String);
		},
		async transaction(db: TransactionDriver, tagId: string, newname: string) {
			const owner = this.userId;
			const tag = await db.findOne(Collection, {
				_id: tagId,
				owner,
			} as Filter<T>);

			if (tag === null) {
				throw new Meteor.Error('not-found');
			}

			const oldname = tag.name;
			newname = newname.trim();

			if (oldname === newname) {
				throw new Meteor.Error(
					'value-error',
					'Cannot rename tag if the new name is the same as the old name.',
				);
			}

			await db.updateMany(
				Parent,
				{[key]: oldname, owner},
				{
					$addToSet: {[key]: newname},
				},
			);

			await db.updateMany(
				Parent,
				{[key]: newname, owner},
				{
					$pull: {[key]: oldname},
				},
			);

			const selector = {
				owner,
				name: newname,
			};

			const newfields = {
				...tag,
				...computedFields(newname),
				...selector,
			};

			delete newfields._id;

			await db.deleteOne(Collection, {_id: tagId} as Filter<T>);
			return db.updateOne(
				Collection,
				selector as Filter<T>,
				{$set: newfields} as Mongo.Modifier<T>,
				{upsert: true},
			);
		},
		simulate(_tagId: string, _newname: string): void {
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
				{[key]: tag.name, owner},
				{$pull: {[key]: tag.name}},
			);

			return db.deleteOne(Collection, {_id: tagId} as Filter<T>);
		},
		simulate(_tagId: string): void {
			return undefined;
		},
	});

	const operations = {
		options: {
			...options,
			stats,
			parentPublicationStats: statsPublication,
		},

		add: async (db: TransactionDriver, owner: string, name: string) => {
			check(owner, String);
			check(name, String);

			name = name.trim();

			const selector = {
				owner,
				name,
			};

			const fields = {
				...computedFields(name),
				...selector,
			};

			return db.updateOne(
				Collection,
				selector as Filter<T>,
				{$set: fields} as Mongo.Modifier<T>,
				{upsert: true},
			);
		},

		remove: async (db: TransactionDriver, owner: string, name: string) => {
			check(owner, String);
			check(name, String);

			name = name.trim();

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
