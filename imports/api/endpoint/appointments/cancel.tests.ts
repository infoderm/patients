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

server(__filename, () => {
	it('can cancel appointment', async () => {
		const userId = Random.id();

		const appointmentId = await newAppointment({userId});

		assert.equal(Appointments.find({}).count(), 1);
		assert.equal(Appointments.find({_id: appointmentId}).count(), 1);

		await invoke(appointmentsCancel, {userId}, [appointmentId, '', '']);

		assert.equal(Appointments.find({}).count(), 1);

		assert.deepInclude(Appointments.findOne({_id: appointmentId}), {
			isCancelled: true,
		});
	});

	it("cannot cancel other user's consultation", async () => {
		const userId = Random.id();

		const appointmentId = await newAppointment({userId});

		return throws(
			() =>
				invoke(appointmentsCancel, {userId: `${userId}x`}, [
					appointmentId,
					'',
					'',
				]),
			/not-found/,
		);
	});

	it('restores availability', async () => {
		const userId = Random.id();

		const appointmentId = await newAppointment({userId});

		const {begin, end} = Appointments.findOne(appointmentId);

		const before = Availability.find().fetch();

		assert.sameDeepMembers(dropIds(before), [
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
		]);

		await invoke(appointmentsCancel, {userId}, [appointmentId, '', '']);

		const after = Availability.find().fetch();
		assert.sameDeepMembers(dropIds(after), [dropId(initialSlot(userId))]);
	});
});
