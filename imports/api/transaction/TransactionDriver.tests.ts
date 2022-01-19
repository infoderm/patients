// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Random} from 'meteor/random';

import {dropId, dropIds, server} from '../../test/fixtures';
import TestingTransactionDriver from './TestingTransactionDriver';
import executeTransaction from './executeTransaction';
import MeteorTransactionSimulationDriver from './MeteorTransactionSimulationDriver';
import TransactionDriver from './TransactionDriver';

server(__filename, () => {
	const MongoDriver = new TestingTransactionDriver(async (txn) =>
		executeTransaction((db) => txn(db)),
	);

	const MeteorDriver = new TestingTransactionDriver((txn) => {
		const db = new MeteorTransactionSimulationDriver();
		return txn(db);
	});

	const it2 = (title, unit: (db: TransactionDriver) => () => Promise<any>) => {
		it(`${title} (Mongo transaction execution)`, unit(MongoDriver));
		it(`${title} (Meteor transaction simulation)`, unit(MeteorDriver));
	};

	const Tests = new Mongo.Collection<any>('test-8h9e8w89hf98239');

	it2('insertOne', (db) => async () => {
		assert.equal(Tests.find().count(), 0);
		const result = await db.insertOne(Tests, {test: 'test'});
		assert.deepInclude(result, {
			acknowledged: true,
		});
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
		const result = await db.insertMany(Tests, [{x}, {y}, {z}]);
		assert.deepInclude(result, {
			acknowledged: true,
			insertedCount: 3,
		});
		assert.deepEqual(
			Tests.find().fetch(),
			[{x}, {y}, {z}].map((t, i) => ({_id: result.insertedIds[i], ...t})),
		);
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
		assert.sameDeepMembers(dropIds(actual), expected);
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
			acknowledged: true,
			deletedCount: 0,
		});
		assert.equal(Tests.find().count(), 3);
		assert.deepInclude(await db.deleteOne(Tests, {x}), {
			acknowledged: true,
			deletedCount: 1,
		});
		assert.equal(Tests.find().count(), 2);
		assert.deepInclude(await db.deleteOne(Tests, {}), {
			acknowledged: true,
			deletedCount: 1,
		});
		assert.equal(Tests.find().count(), 1);
		assert.deepInclude(await db.deleteOne(Tests, {}), {
			acknowledged: true,
			deletedCount: 1,
		});
		assert.equal(Tests.find().count(), 0);
		assert.deepInclude(await db.deleteOne(Tests, {}), {
			acknowledged: true,
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
			acknowledged: true,
			deletedCount: 0,
		});
		assert.equal(Tests.find().count(), 3);
		assert.deepInclude(await db.deleteMany(Tests, {x}), {
			acknowledged: true,
			deletedCount: 1,
		});
		assert.equal(Tests.find().count(), 2);
		assert.deepInclude(await db.deleteMany(Tests, {}), {
			acknowledged: true,
			deletedCount: 2,
		});
		assert.equal(Tests.find().count(), 0);
		assert.deepInclude(await db.deleteMany(Tests, {}), {
			acknowledged: true,
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
		const op1 = await db.updateOne(Tests, {}, {$set: {w}});
		assert.deepInclude(op1, {
			acknowledged: true,
			matchedCount: 1,
			upsertedCount: 0,
		});
		assert.oneOf(op1.modifiedCount, [1, undefined]);
		const op2 = await db.updateOne(Tests, {z}, {$set: {w}});
		assert.deepInclude(op2, {
			acknowledged: true,
			matchedCount: 1,
			upsertedCount: 0,
		});
		assert.oneOf(op1.modifiedCount, [1, undefined]);
		const expected = [{x, w}, {y}, {z, w}];
		const actual = Tests.find().fetch();
		assert.sameDeepMembers(dropIds(actual), expected);
	});

	it2('updateOne [upsert]', (db) => async () => {
		const x = Random.id();
		const y = Random.id();
		const z = Random.id();
		assert.equal(Tests.find().count(), 0);
		const result = await db.updateOne(Tests, {x}, {$set: {y}}, {upsert: true});
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
		assert.sameDeepMembers(dropIds(actual), expected);
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
		const result = await db.updateMany(Tests, {}, {$set: {w}});
		assert.deepInclude(result, {
			acknowledged: true,
			matchedCount: 3,
			upsertedCount: 0,
		});
		assert.oneOf(result.modifiedCount, [3, undefined]);
		const expected = [
			{x, w},
			{y, w},
			{z, w},
		];
		const actual = Tests.find().fetch();
		assert.sameDeepMembers(dropIds(actual), expected);
	});
});