// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Random} from 'meteor/random';

import {
	Appointments,
	newAppointmentFormData,
	newAppointment,
} from '../../collection/appointments.mock';
import {Availability} from '../../collection/availability.mock';
import {slot} from '../../availability';
import {beginningOfTime, endOfTime} from '../../../util/datetime';
import {dropIds, server} from '../../../test/fixtures';
import invoke from '../invoke';
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
	it('updates availability', async () => {
		const userId = Random.id();

		const appointmentId = await newAppointment({userId});

		const before = Appointments.findOne();

		assert.equal(before._id, appointmentId);
		assert.sameDeepMembers(
			dropIds(Availability.find().fetch()),
			expected(before),
		);

		const updated = newAppointmentFormData();

		await invoke(appointmentsReschedule, {userId}, [appointmentId, updated]);

		const after = Appointments.findOne();

		assert.equal(after._id, appointmentId);
		assert.sameDeepMembers(
			dropIds(Availability.find().fetch()),
			expected(after),
		);
	});
});
