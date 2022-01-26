// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Random} from 'meteor/random';

import addMinutes from 'date-fns/addMinutes';

import cancelAppointment from '../appointments/cancel';

import invoke from '../invoke';

import {Availability} from '../../collection/availability';
import {units} from '../../duration';
import {initialSlot, slot} from '../../availability';
import {beginningOfTime, endOfTime} from '../../../util/datetime';
import {dropId, server} from '../../../test/fixtures';
import {newAppointment} from '../../_dev/populate/appointments';
import next from './next';

const bookSlot = async (userId, begin, end) => {
	return newAppointment(
		{userId},
		{
			datetime: begin,
			duration: end - begin,
		},
	);
};

const findNextAvailable = async (userId, after, durationInMinutes) => {
	const duration = durationInMinutes * units.minute;

	const week: Array<[number, number]> = [[0, units.week + duration]];

	const constraints = week;

	return dropId(await invoke(next, {userId}, [after, duration, constraints]));
};

server(__filename, () => {
	it('starts with complete availability', async () => {
		const userId = Random.id();

		assert.deepEqual(Availability.findOne(), undefined);

		const actual = await findNextAvailable(userId, new Date(), 1);
		const expected = dropId(initialSlot(userId));

		assert.deepEqual(actual, expected);
	});

	it('stays with complete availability', async () => {
		const userId = Random.id();

		const now = new Date();

		const appointmentId = await bookSlot(userId, now, addMinutes(now, 15));

		await invoke(cancelAppointment, {userId}, [appointmentId, '', '']);

		const actual = await findNextAvailable(userId, now, 1);

		const expected = dropId(initialSlot(userId));

		assert.deepEqual(actual, expected);
	});

	it('can find next available slot', async () => {
		const userId = Random.id();

		const now = new Date();

		await bookSlot(userId, now, addMinutes(now, 15));

		const actual = await findNextAvailable(userId, now, 1);
		const expected = {
			...slot(addMinutes(now, 15), endOfTime(), 0),
			owner: userId,
		};

		assert.deepEqual(actual, expected);
	});

	it('can find next available slot of correct size', async () => {
		const userId = Random.id();

		const now = new Date();

		await bookSlot(userId, addMinutes(now, 1), addMinutes(now, 16));

		const actual2 = await findNextAvailable(userId, now, 2);

		const expected2 = {
			...slot(addMinutes(now, 16), endOfTime(), 0),
			owner: userId,
		};

		assert.deepEqual(actual2, expected2);

		const actual1 = await findNextAvailable(userId, now, 1);

		const expected1 = {
			...slot(beginningOfTime(), addMinutes(now, 1), 0),
			owner: userId,
		};

		assert.deepEqual(actual1, expected1);
	});
});
