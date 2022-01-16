// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Random} from 'meteor/random';

import {Appointments, newAppointment} from '../../collection/appointments.mock';

import {Availability} from '../../collection/availability.mock';
import {initialSlot, slot} from '../../availability';
import {beginningOfTime, endOfTime} from '../../../util/datetime';
import {dropId, dropIds, server, throws} from '../../../test/fixtures';

import invoke from '../invoke';
import appointmentsCancel from './cancel';
import appointmentsUncancel from './uncancel';

server(__filename, () => {
	it('can uncancel appointment', async () => {
		const userId = Random.id();

		const appointmentId = await newAppointment({userId});

		assert.equal(Appointments.find({}).count(), 1);
		assert.equal(Appointments.find({_id: appointmentId}).count(), 1);

		await invoke(appointmentsCancel, {userId}, [appointmentId, '', '']);

		assert.equal(Appointments.find({}).count(), 1);

		assert.deepInclude(Appointments.findOne({_id: appointmentId}), {
			isCancelled: true,
		});

		await invoke(appointmentsUncancel, {userId}, [appointmentId]);

		assert.equal(Appointments.find({}).count(), 1);

		assert.deepInclude(Appointments.findOne({_id: appointmentId}), {
			isCancelled: false,
		});
	});

	it("cannot cancel other user's consultation", async () => {
		const userId = Random.id();

		const appointmentId = await newAppointment({userId});

		await invoke(appointmentsCancel, {userId}, [appointmentId, '', '']);

		return throws(
			() =>
				invoke(appointmentsUncancel, {userId: `${userId}x`}, [appointmentId]),
			/not-found/,
		);
	});

	it('fills availability', async () => {
		const userId = Random.id();

		const appointmentId = await newAppointment({userId});

		const {begin, end} = Appointments.findOne(appointmentId);

		const before = Availability.find().fetch();

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

		const during = Availability.find().fetch();
		assert.sameDeepMembers(dropIds(during), [dropId(initialSlot(userId))]);

		await invoke(appointmentsUncancel, {userId}, [appointmentId]);
		const after = Availability.find().fetch();

		assert.sameDeepMembers(dropIds(after), expected);
	});
});
