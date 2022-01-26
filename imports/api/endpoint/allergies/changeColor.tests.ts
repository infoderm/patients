// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Random} from 'meteor/random';

import {Allergies} from '../../collection/allergies';
import {newAllergy} from '../../_dev/populate/allergies';

import {server, throws} from '../../../test/fixtures';

import invoke from '../invoke';
import changeAllergyColor from './changeColor';

server(__filename, () => {
	it('can change color of allergy', async () => {
		const userId = Random.id();

		const {upsertedId: allergyId} = await newAllergy({userId});

		assert.equal(Allergies.find({}).count(), 1);
		assert.equal(Allergies.find({_id: allergyId}).count(), 1);
		assert.equal(Allergies.findOne({_id: allergyId}).color, undefined);

		const expected = '#fff';

		await invoke(changeAllergyColor, {userId}, [allergyId, expected]);

		assert.equal(Allergies.find({}).count(), 1);

		assert.deepInclude(Allergies.findOne({_id: allergyId}), {
			color: expected,
		});
	});

	it('cannot change color of allergy if not logged in', async () => {
		const userId = Random.id();

		const {upsertedId: allergyId} = await newAllergy({userId});

		assert.equal(Allergies.find({}).count(), 1);
		assert.equal(Allergies.find({_id: allergyId}).count(), 1);
		assert.equal(Allergies.findOne({_id: allergyId}).color, undefined);

		const expected = '#fff';

		await throws(
			async () => invoke(changeAllergyColor, {}, [allergyId, expected]),
			/not-authorized/,
		);

		assert.equal(Allergies.find({}).count(), 1);

		assert.notDeepInclude(Allergies.findOne({_id: allergyId}), {
			color: expected,
		});
	});

	it('cannot change color of allergy of other user', async () => {
		const userId = Random.id();

		const {upsertedId: allergyId} = await newAllergy({userId});

		assert.equal(Allergies.find({}).count(), 1);
		assert.equal(Allergies.find({_id: allergyId}).count(), 1);
		assert.equal(Allergies.findOne({_id: allergyId}).color, undefined);

		const expected = '#fff';

		await throws(
			async () =>
				invoke(changeAllergyColor, {userId: `${userId}x`}, [
					allergyId,
					expected,
				]),
			/not-found/,
		);

		assert.equal(Allergies.find({}).count(), 1);

		assert.notDeepInclude(Allergies.findOne({_id: allergyId}), {
			color: expected,
		});
	});
});
