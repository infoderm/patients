// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';

import {dropId, dropIds} from '../../test/fixtures';
import MetaWrapper from './MetaWrapper';
import executeTransaction from './executeTransaction';
import MinimongoWrapper from './MinimongoWrapper';
import Wrapper from './Wrapper';

const mongoWrapper = new MetaWrapper(async (txn) =>
	executeTransaction((db) => txn(db)),
);

const meteorWrapper = new MetaWrapper((txn) => {
	const db = new MinimongoWrapper();
	return txn(db);
});

const it2 = (title, txn: (db: Wrapper) => () => Promise<any>) => {
	it(`${title} (mongo)`, txn(mongoWrapper));
	it(`${title} (meteor)`, txn(meteorWrapper));
};

const Tests = new Mongo.Collection<any>('test-8h9e8w89hf98239');

if (Meteor.isServer) {
	describe('api', () => {
		describe('transaction', () => {
			describe('Wrapper interface', () => {
				beforeEach(() => {
					Tests.remove({});
				});

				it2('insertOne', (db) => async () => {
					assert.equal(Tests.find().count(), 0);
					const result = await db.insertOne(Tests, {test: 'test'});
					assert.containsAllKeys(result, ['insertedId']);
					assert.isString(result.insertedId);
					assert.deepEqual(Tests.findOne(), {
						_id: result.insertedId,
						test: 'test',
					});
				});

				it2('insertMany', (db) => async () => {
					const x = Random.id();
					const y = Random.id();
					const z = Random.id();
					assert.equal(Tests.find().count(), 0);
					await db.insertMany(Tests, [{x}, {y}, {z}]);
					assert.equal(Tests.find().count(), 3);
				});

				it2('findOne', (db) => async () => {
					const x = Random.id();
					const y = Random.id();
					const z = Random.id();
					const w = Random.id();
					assert.equal(Tests.find().count(), 0);
					await db.insertOne(Tests, {x});
					await db.insertOne(Tests, {y});
					await db.insertOne(Tests, {z});
					assert.equal(Tests.find().count(), 3);
					const expected = {y};
					const actual = await db.findOne(Tests, expected);
					assert.deepEqual(dropId(actual), expected);

					const shoudBeNull = await db.findOne(Tests, {w});
					assert.equal(shoudBeNull, null);
				});

				it2('fetch', (db) => async () => {
					const x = Random.id();
					const y = Random.id();
					const z = Random.id();
					assert.equal(Tests.find().count(), 0);
					await db.insertOne(Tests, {x});
					await db.insertOne(Tests, {y});
					await db.insertOne(Tests, {z});
					assert.equal(Tests.find().count(), 3);
					const expected = [{x}, {y}, {z}];
					const actual = await db.fetch(Tests, {});
					assert.deepEqual(dropIds(actual), expected);
				});

				it2('deleteOne', (db) => async () => {
					const x = Random.id();
					const y = Random.id();
					const z = Random.id();
					const w = Random.id();
					assert.equal(Tests.find().count(), 0);
					await db.insertOne(Tests, {x});
					await db.insertOne(Tests, {y});
					await db.insertOne(Tests, {z});
					assert.equal(Tests.find().count(), 3);
					assert.deepInclude(await db.deleteOne(Tests, {w}), {
						deletedCount: 0,
					});
					assert.equal(Tests.find().count(), 3);
					assert.deepInclude(await db.deleteOne(Tests, {x}), {
						deletedCount: 1,
					});
					assert.equal(Tests.find().count(), 2);
					assert.deepInclude(await db.deleteOne(Tests, {}), {
						deletedCount: 1,
					});
					assert.equal(Tests.find().count(), 1);
					assert.deepInclude(await db.deleteOne(Tests, {}), {
						deletedCount: 1,
					});
					assert.equal(Tests.find().count(), 0);
					assert.deepInclude(await db.deleteOne(Tests, {}), {
						deletedCount: 0,
					});
					assert.equal(Tests.find().count(), 0);
				});

				it2('deleteMany', (db) => async () => {
					const x = Random.id();
					const y = Random.id();
					const z = Random.id();
					const w = Random.id();
					assert.equal(Tests.find().count(), 0);
					await db.insertOne(Tests, {x});
					await db.insertOne(Tests, {y});
					await db.insertOne(Tests, {z});
					assert.equal(Tests.find().count(), 3);
					assert.deepInclude(await db.deleteMany(Tests, {w}), {
						deletedCount: 0,
					});
					assert.equal(Tests.find().count(), 3);
					assert.deepInclude(await db.deleteMany(Tests, {x}), {
						deletedCount: 1,
					});
					assert.equal(Tests.find().count(), 2);
					assert.deepInclude(await db.deleteMany(Tests, {}), {
						deletedCount: 2,
					});
					assert.equal(Tests.find().count(), 0);
					assert.deepInclude(await db.deleteMany(Tests, {}), {
						deletedCount: 0,
					});
					assert.equal(Tests.find().count(), 0);
				});

				it2('updateOne', (db) => async () => {
					const x = Random.id();
					const y = Random.id();
					const z = Random.id();
					const w = Random.id();
					assert.equal(Tests.find().count(), 0);
					await db.insertOne(Tests, {x});
					await db.insertOne(Tests, {y});
					await db.insertOne(Tests, {z});
					assert.equal(Tests.find().count(), 3);
					await db.updateOne(Tests, {}, {$set: {w}});
					await db.updateOne(Tests, {z}, {$set: {w}});
					const expected = [{x, w}, {y}, {z, w}];
					const actual = Tests.find().fetch();
					assert.deepEqual(dropIds(actual), expected);
				});

				it2('updateOne [upsert]', (db) => async () => {
					const x = Random.id();
					const y = Random.id();
					const z = Random.id();
					assert.equal(Tests.find().count(), 0);
					const result = await db.updateOne(
						Tests,
						{x},
						{$set: {y}},
						{upsert: true},
					);
					const {_id} = Tests.findOne();
					assert.deepInclude(result, {
						acknowledged: true,
						matchedCount: 0,
						upsertedCount: 1,
						upsertedId: _id,
					});
					assert.equal(Tests.find().count(), 1);
					assert.deepInclude(
						await db.updateOne(Tests, {x}, {$set: {z}}, {upsert: true}),
						{
							acknowledged: true,
							matchedCount: 1,
							upsertedCount: 0,
						},
					);
					assert.equal(Tests.find().count(), 1);
					assert.deepInclude(
						await db.updateOne(Tests, {x}, {$set: {z}}, {upsert: true}),
						{
							acknowledged: true,
							matchedCount: 1,
							upsertedCount: 0,
						},
					);
					assert.equal(Tests.find().count(), 1);
					const expected = [{x, y, z}];
					const actual = Tests.find().fetch();
					assert.deepEqual(dropIds(actual), expected);
				});

				it2('updateMany', (db) => async () => {
					const x = Random.id();
					const y = Random.id();
					const z = Random.id();
					const w = Random.id();
					assert.equal(Tests.find().count(), 0);
					await db.insertOne(Tests, {x});
					await db.insertOne(Tests, {y});
					await db.insertOne(Tests, {z});
					assert.equal(Tests.find().count(), 3);
					await db.updateMany(Tests, {}, {$set: {w}});
					const expected = [
						{x, w},
						{y, w},
						{z, w},
					];
					const actual = Tests.find().fetch();
					assert.deepEqual(dropIds(actual), expected);
				});
			});
		});
	});
}
