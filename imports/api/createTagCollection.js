import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

const STATS_SUFFIX = '.stats';

export default function createTagCollection(options) {
	const {
		collection,
		publication,
		singlePublication, // Optional
		parentPublication,
		key
	} = options;

	const stats = collection + STATS_SUFFIX;
	const parentPublicationStats = parentPublication + STATS_SUFFIX;

	const Collection = new Mongo.Collection(collection);
	const Stats = new Mongo.Collection(stats);

	if (Meteor.isServer) {
		Meteor.publish(publication, function (args) {
			const query = {...args, owner: this.userId};
			return Collection.find(query);
		});
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
			parentPublicationStats
		},

		cache: {Stats},

		add: (owner, name) => {
			check(owner, String);
			check(name, String);

			name = name.trim();

			const fields = {
				owner,
				name
			};

			return Collection.upsert(fields, {$set: fields});
		},

		remove: (owner, name) => {
			check(owner, String);
			check(name, String);

			name = name.trim();

			const fields = {
				owner,
				name
			};

			return Collection.remove(fields);
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
								...fields
							}
						};
						for (const key of Object.keys(query)) {
							_options.fields[key] = 1;
						}

						return Parent.find(query, _options);
					}

					return Parent.find(query, options);
				});

				// Publish the current size of a collection.
				Meteor.publish(parentPublicationStats, function (tag) {
					check(tag, String);
					const query = {[key]: tag, owner: this.userId};
					// We only include relevant fields
					const options = {fields: {_id: 1, [key]: 1}};

					let count = 0;
					let initializing = true;

					// `observeChanges` only returns after the initial `added` callbacks have run.
					// Until then, we don't want to send a lot of `changed` messages—hence
					// tracking the `initializing` state.
					const handle = Parent.find(query, options).observeChanges({
						added: (_id) => {
							count += 1;

							if (!initializing) {
								this.changed(stats, tag, {count});
							}
						},

						removed: (_id) => {
							count -= 1;
							this.changed(stats, tag, {count});
						}

						// We don't care about `changed` events.
					});

					// Instead, we'll send one `added` message right after `observeChanges` has
					// returned, and mark the subscription as ready.
					initializing = false;
					this.added(stats, tag, {count});
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
							$addToSet: {[key]: newname}
						},
						{multi: true}
					);

					Parent.update(
						{[key]: newname, owner},
						{
							$pull: {[key]: oldname}
						},
						{multi: true}
					);

					const targetfields = {
						owner,
						name: newname
					};

					const newfields = {
						...tag,
						name: newname
					};

					delete newfields._id;

					Collection.remove(tagId);
					return Collection.upsert(targetfields, {$set: newfields});
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
						{multi: true}
					);
					return Collection.remove(tagId);
				}
			});
		}
	};

	return {Collection, operations};
}
