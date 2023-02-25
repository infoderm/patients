// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Random} from 'meteor/random';

import {dropId, dropIds, server, throws} from '../../../test/fixtures';
import {beginningOfTime, endOfTime} from '../../../lib/datetime';

import {Appointments} from '../../collection/appointments';
import {Availability} from '../../collection/availability';
import {newAppointment} from '../../_dev/populate/appointments';

import {initialSlot, slot} from '../../availability';

import invoke from '../invoke';
import appointmentsCancel from './cancel';
import appointmentsUncancel from './uncancel';

server(__filename, () => {
	it('can uncancel appointment', async () => {
		const userId = Random.id();

		const appointmentId = await newAppointment({userId});

		assert.equal(await Appointments.find({}).countAsync(), 1);
		assert.equal(await Appointments.find({_id: appointmentId}).countAsync(), 1);

		await invoke(appointmentsCancel, {userId}, [appointmentId, '', '']);

		assert.equal(await Appointments.find({}).countAsync(), 1);

		assert.deepInclude(await Appointments.findOneAsync({_id: appointmentId}), {
			isCancelled: true,
		});

		await invoke(appointmentsUncancel, {userId}, [appointmentId]);

		assert.equal(await Appointments.find({}).countAsync(), 1);

		assert.deepInclude(await Appointments.findOneAsync({_id: appointmentId}), {
			isCancelled: false,
		});
	});

	it("cannot cancel other user's consultation", async () => {
		const userId = Random.id();

		const appointmentId = await newAppointment({userId});

		await invoke(appointmentsCancel, {userId}, [appointmentId, '', '']);

		return throws(
			async () =>
				invoke(appointmentsUncancel, {userId: `${userId}x`}, [appointmentId]),
			/not-found/,
		);
	});

	it('fills availability', async () => {
		const userId = Random.id();

		const appointmentId = await newAppointment({userId});

		const {begin, end} = await Appointments.findOneAsync(appointmentId);

		const before = await Availability.find().fetchAsync();

		const expected = [
			{
				...slot(beginningOfTime(), begin, 0),
				owner: userId,
			},
			{
				...slot(begin, end, 1),
				owner: userId,
			},
			{
				...slot(end, endOfTime(), 0),
				owner: userId,
			},
		];

		assert.sameDeepMembers(dropIds(before), expected);

		await invoke(appointmentsCancel, {userId}, [appointmentId, '', '']);

		const during = await Availability.find().fetchAsync();
		assert.sameDeepMembers(dropIds(during), [dropId(initialSlot(userId))]);

		await invoke(appointmentsUncancel, {userId}, [appointmentId]);
		const after = await Availability.find().fetchAsync();

		assert.sameDeepMembers(dropIds(after), expected);
	});
});
