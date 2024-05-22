import {assert} from 'chai';

import {Appointments} from '../../collection/appointments';
import {Availability} from '../../collection/availability';
import {
	newAppointment,
	newAppointmentFormData,
} from '../../_dev/populate/appointments';
import {slot} from '../../availability';
import {beginningOfTime, endOfTime} from '../../../lib/datetime';
import {
	dropIds,
	findOneOrThrow,
	randomUserId,
	server,
	throws,
} from '../../../_test/fixtures';
import invoke from '../invoke';
import {type AuthenticatedContext} from '../Context';

import appointmentsReschedule from './reschedule';

const expected = ({owner, begin, end}) => [
	{
		...slot(beginningOfTime(), begin, 0),
		owner,
	},
	{
		...slot(begin, end, 1),
		owner,
	},
	{
		...slot(end, endOfTime(), 0),
		owner,
	},
];

server(__filename, () => {
	it('does not work without being logged in', async () => {
		const userId = randomUserId();

		const appointmentId = await newAppointment({userId});

		const before = await Appointments.findOneAsync();

		const updated = newAppointmentFormData();

		await throws(
			async () =>
				invoke(appointmentsReschedule, {} as AuthenticatedContext, [
					appointmentId,
					updated,
				]),
			/not-authorized/,
		);

		const after = await Appointments.findOneAsync();

		assert.deepEqual(after, before);
	});

	it("cannot reschedule other user's appointments", async () => {
		const userId = randomUserId();

		const appointmentId = await newAppointment({userId});

		const before = await Appointments.findOneAsync();

		const updated = newAppointmentFormData();

		await throws(
			async () =>
				invoke(appointmentsReschedule, {userId: `${userId}x`}, [
					appointmentId,
					updated,
				]),
			/not-found/,
		);

		const after = await Appointments.findOneAsync();

		assert.deepEqual(after, before);
	});

	it('updates availability', async () => {
		const userId = randomUserId();

		const appointmentId = await newAppointment({userId});

		const before = await findOneOrThrow(Appointments);

		assert.strictEqual(before._id, appointmentId);
		assert.sameDeepMembers(
			dropIds(await Availability.find().fetchAsync()),
			expected(before),
		);

		const updated = newAppointmentFormData();

		await invoke(appointmentsReschedule, {userId}, [appointmentId, updated]);

		const after = await findOneOrThrow(Appointments);

		assert.strictEqual(after._id, appointmentId);
		assert.sameDeepMembers(
			dropIds(await Availability.find().fetchAsync()),
			expected(after),
		);
	});
});
