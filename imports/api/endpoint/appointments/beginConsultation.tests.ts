// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {
	dropId,
	dropIds,
	findOneOrThrow,
	randomUserId,
	server,
	throws,
} from '../../../_test/fixtures';
import {beginningOfTime, endOfTime} from '../../../lib/datetime';

import {Appointments} from '../../collection/appointments';
import {Availability} from '../../collection/availability';
import {newAppointment} from '../../_dev/populate/appointments';

import {initialSlot, slot} from '../../availability';

import invoke from '../invoke';

import appointmentsBeginConsultation from './beginConsultation';

server(__filename, () => {
	it('can begin consultation', async () => {
		const userId = randomUserId();

		const appointmentId = await newAppointment({userId});

		assert.equal(await Appointments.find({}).countAsync(), 1);
		assert.equal(await Appointments.find({_id: appointmentId}).countAsync(), 1);

		await invoke(appointmentsBeginConsultation, {userId}, [appointmentId]);

		assert.equal(await Appointments.find({}).countAsync(), 1);

		assert.deepInclude(await Appointments.findOneAsync({_id: appointmentId}), {
			isDone: true,
		});
	});

	it("cannot begin other user's consultation", async () => {
		const userId = randomUserId();

		const appointmentId = await newAppointment({userId});

		return throws(
			async () =>
				invoke(appointmentsBeginConsultation, {userId: `${userId}x`}, [
					appointmentId,
				]),
			/not-found/,
		);
	});

	it('cannot begin consultation when not logged in', async () => {
		const userId = randomUserId();

		const appointmentId = await newAppointment({userId});

		return throws(
			async () =>
				invoke(appointmentsBeginConsultation, {userId: undefined!}, [
					appointmentId,
				]),
			/not-authorized/,
		);
	});

	it('restores availability', async () => {
		const userId = randomUserId();

		const appointmentId = await newAppointment({userId});

		const {begin, end} = await findOneOrThrow(Appointments, appointmentId);

		const before = await Availability.find().fetchAsync();

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

		await invoke(appointmentsBeginConsultation, {userId}, [appointmentId]);

		const after = await Availability.find().fetchAsync();
		assert.sameDeepMembers(dropIds(after), [dropId(initialSlot(userId))]);
	});
});
