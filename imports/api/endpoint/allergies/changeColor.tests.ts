// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Allergies} from '../../collection/allergies';
import {newAllergy} from '../../_dev/populate/allergies';

import {
	findOneOrThrow,
	randomUserId,
	server,
	throws,
} from '../../../_test/fixtures';

import invoke from '../invoke';
import {type AuthenticatedContext} from '../Context';
import changeAllergyColor from './changeColor';

server(__filename, () => {
	it('can change color of allergy', async () => {
		const userId = randomUserId();

		const {upsertedId: allergyId} = await newAllergy({userId});

		assert.equal(await Allergies.find({}).countAsync(), 1);
		assert.equal(await Allergies.find({_id: allergyId}).countAsync(), 1);
		const {color} = await findOneOrThrow(Allergies, {_id: allergyId});
		assert.equal(color, undefined);

		const expected = '#fff';

		await invoke(changeAllergyColor, {userId}, [allergyId, expected]);

		assert.equal(await Allergies.find({}).countAsync(), 1);

		assert.deepInclude(await Allergies.findOneAsync({_id: allergyId}), {
			color: expected,
		});
	});

	it('cannot change color of allergy if not logged in', async () => {
		const userId = randomUserId();

		const {upsertedId: allergyId} = await newAllergy({userId});

		assert.equal(await Allergies.find({}).countAsync(), 1);
		assert.equal(await Allergies.find({_id: allergyId}).countAsync(), 1);

		const {color} = await findOneOrThrow(Allergies, {_id: allergyId});
		assert.equal(color, undefined);

		const expected = '#fff';

		await throws(
			async () =>
				invoke(changeAllergyColor, {} as AuthenticatedContext, [
					allergyId,
					expected,
				]),
			/not-authorized/,
		);

		assert.equal(await Allergies.find({}).countAsync(), 1);

		assert.notDeepInclude(await Allergies.findOneAsync({_id: allergyId}), {
			color: expected,
		});
	});

	it('cannot change color of allergy of other user', async () => {
		const userId = randomUserId();

		const {upsertedId: allergyId} = await newAllergy({userId});

		assert.equal(await Allergies.find({}).countAsync(), 1);
		assert.equal(await Allergies.find({_id: allergyId}).countAsync(), 1);
		const {color} = await findOneOrThrow(Allergies, {_id: allergyId});
		assert.equal(color, undefined);

		const expected = '#fff';

		await throws(
			async () =>
				invoke(changeAllergyColor, {userId: `${userId}x`}, [
					allergyId,
					expected,
				]),
			/not-found/,
		);

		assert.equal(await Allergies.find({}).countAsync(), 1);

		assert.notDeepInclude(await Allergies.findOneAsync({_id: allergyId}), {
			color: expected,
		});
	});
});
