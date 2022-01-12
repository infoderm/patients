// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';

import {dropId} from '../../test/fixtures';
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
					await db.insertOne(Tests, {test: 'test'});
					assert.deepEqual(dropId(Tests.findOne()), {test: 'test'});
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
			});
		});
	});
}
