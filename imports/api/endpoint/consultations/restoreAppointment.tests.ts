// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {dropIds, randomUserId, server, throws} from '../../../_test/fixtures';
import {beginningOfTime, endOfTime} from '../../../lib/datetime';

import {Appointments} from '../../collection/appointments';
import {Availability} from '../../collection/availability';
import {newAppointment} from '../../_dev/populate/appointments';

import {slot} from '../../availability';

import invoke from '../invoke';
import appointmentsBeginConsultation from '../appointments/beginConsultation';
import restoreAppointment from './restoreAppointment';

server(__filename, () => {
	it('can restore appointment', async () => {
		const userId = randomUserId();

		const appointmentId = await newAppointment({userId});

		await invoke(appointmentsBeginConsultation, {userId}, [appointmentId]);

		await invoke(restoreAppointment, {userId}, [appointmentId]);

		assert.equal(await Appointments.find({}).countAsync(), 1);

		assert.deepInclude(await Appointments.findOneAsync({_id: appointmentId}), {
			isDone: false,
		});
	});

	it("cannot restore other user's appointment", async () => {
		const userId = randomUserId();

		const appointmentId = await newAppointment({userId});

		await invoke(appointmentsBeginConsultation, {userId}, [appointmentId]);

		return throws(
			async () =>
				invoke(restoreAppointment, {userId: `${userId}x`}, [appointmentId]),
			/not-found/,
		);
	});

	it('cannot restore appointment when not logged in', async () => {
		const userId = randomUserId();

		const appointmentId = await newAppointment({userId});

		await invoke(appointmentsBeginConsultation, {userId}, [appointmentId]);

		return throws(
			async () =>
				invoke(restoreAppointment, {userId: undefined}, [appointmentId]),
			/not-authorized/,
		);
	});

	it('updates availability', async () => {
		const userId = randomUserId();

		const appointmentId = await newAppointment({userId});

		const {begin, end} = await Appointments.findOneAsync(appointmentId);

		await invoke(appointmentsBeginConsultation, {userId}, [appointmentId]);

		await invoke(restoreAppointment, {userId}, [appointmentId]);

		const after = await Availability.find().fetchAsync();

		assert.sameDeepMembers(dropIds(after), [
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
	});
});
