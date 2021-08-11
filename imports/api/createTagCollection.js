import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

import makeQuery from './makeQuery';
import makeObservedQueryHook from './makeObservedQueryHook';
import makeObservedQueryPublication from './makeObservedQueryPublication';
import pageQuery from './pageQuery';

import {containsNonAlphabetical} from './string';

export const STATS_SUFFIX = '.stats';
export const FIND_CACHE_SUFFIX = '.find.cache';
export const FIND_OBSERVE_SUFFIX = '.find.observe';

const computedFields = (name) => ({
	containsNonAlphabetical: containsNonAlphabetical(name),
});

export default function createTagCollection(options) {
	const {
		collection,
		publication,
		singlePublication, // Optional
		parentPublication,
		key,
	} = options;

	const stats = collection + STATS_SUFFIX;
	const parentPublicationStats = parentPublication + STATS_SUFFIX;

	const cacheCollection = collection + FIND_CACHE_SUFFIX;
	const cachePublication = collection + FIND_OBSERVE_SUFFIX;

	const Collection = new Mongo.Collection(collection);
	const Stats = new Mongo.Collection(stats);

	const TagsCache = new Mongo.Collection(cacheCollection);

	const useTags = makeQuery(Collection, publication);

	// TODO rename to useObservedTags
	const useTagsFind = makeObservedQueryHook(TagsCache, cachePublication);

	if (Meteor.isServer) {
		Meteor.publish(publication, pageQuery(Collection));

		Meteor.publish(
			cachePublication,
			makeObservedQueryPublication(Collection, cacheCollection),
		);

		if (singlePublication) {
			Meteor.publish(singlePublication, function (name) {
				return Collection.find({owner: this.userId, name});
			});
		}
	}

	const operations = {
		options: {
			...options,
			stats,
			parentPublicationStats,
		},

		cache: {Stats},

		add: (owner, name) => {
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

			return Collection.upsert(selector, {$set: fields});
		},

		remove: (owner, name) => {
			check(owner, String);
			check(name, String);

			name = name.trim();

			const selector = {
				owner,
				name,
			};

			return Collection.remove(selector);
		},

		init: (Parent) => {
			if (Meteor.isServer) {
				Meteor.publish(parentPublication, function (tag, options = {}) {
					check(tag, String);
					const query = {[key]: tag, owner: this.userId};
					if (options.fields) {
						const {fields, ...rest} = options;
						const _options = {
							...rest,
							fields: {
								...fields,
							},
						};
						for (const key of Object.keys(query)) {
							_options.fields[key] = 1;
						}

						return Parent.find(query, _options);
					}

					return Parent.find(query, options);
				});

				// Publish the current size of a collection.
				Meteor.publish(parentPublicationStats, function (name) {
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
					this.onStop(() => handle.stop());
				});
			}

			Meteor.methods({
				[`${collection}.rename`](tagId, newname) {
					check(tagId, String);
					check(newname, String);

					const tag = Collection.findOne(tagId);
					const owner = tag.owner;

					if (owner !== this.userId) {
						throw new Meteor.Error('not-authorized');
					}

					const oldname = tag.name;
					newname = newname.trim();

					Parent.update(
						{[key]: oldname, owner},
						{
							$addToSet: {[key]: newname},
						},
						{multi: true},
					);

					Parent.update(
						{[key]: newname, owner},
						{
							$pull: {[key]: oldname},
						},
						{multi: true},
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

					Collection.remove(tagId);
					return Collection.upsert(selector, {$set: newfields});
				},

				[`${collection}.delete`](tagId) {
					check(tagId, String);

					const tag = Collection.findOne(tagId);
					const owner = tag.owner;

					if (owner !== this.userId) {
						throw new Meteor.Error('not-authorized');
					}

					Parent.update(
						{[key]: tag.name, owner},
						{$pull: {[key]: tag.name}},
						{multi: true},
					);
					return Collection.remove(tagId);
				},
			});
		},
	};

	return {Collection, operations, useTags, useTagsFind};
}
