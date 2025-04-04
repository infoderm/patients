import {assert} from 'chai';

import {
	dropId,
	dropIds,
	findOneOrThrow,
	randomUserId,
	server,
	throws,
} from '../../../_test/fixtures';
import {beginningOfTime, endOfTime} from '../../../util/datetime';

import {Appointments} from '../../collection/appointments';
import {Availability} from '../../collection/availability';
import {newAppointment} from '../../_dev/populate/appointments';

import {initialSlot, slot} from '../../availability';

import invoke from '../invoke';

import appointmentsRemove from './remove';

server(__filename, () => {
	it('can remove appointment', async () => {
		const userId = randomUserId();

		const appointmentId = await newAppointment({userId});

		assert.strictEqual(await Appointments.find({}).countAsync(), 1);
		assert.strictEqual(
			await Appointments.find({_id: appointmentId}).countAsync(),
			1,
		);

		await invoke(appointmentsRemove, {userId}, [appointmentId]);

		assert.strictEqual(await Appointments.find({}).countAsync(), 0);
	});

	it("cannot remove other user's consultation", async () => {
		const userId = randomUserId();

		const appointmentId = await newAppointment({userId});

		return throws(
			async () =>
				invoke(appointmentsRemove, {userId: `${userId}x`}, [appointmentId]),
			/not-found/,
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

		await invoke(appointmentsRemove, {userId}, [appointmentId]);

		const after = await Availability.find().fetchAsync();
		assert.sameDeepMembers(dropIds(after), [dropId(initialSlot(userId))]);
	});
});
