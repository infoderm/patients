// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import addMinutes from 'date-fns/addMinutes';

import {map} from '@iterable-iterator/map';
import {sorted} from '@iterable-iterator/sorted';

import startOfDay from 'date-fns/startOfDay';
import {
	beginningOfTime,
	endOfTime,
	someDateAtGivenDayOfWeek,
} from '../../../lib/datetime';
import {dropId, randomUserId, server} from '../../../test/fixtures';
import nonOverlappingIntersection from '../../../lib/interval/nonOverlappingIntersection';
import {weekSlotsCyclicOrder} from '../../../ui/settings/useWorkScheduleSort';
import {Availability} from '../../collection/availability';
import {units} from '../../duration';
import {initialSlot, slot} from '../../availability';
import {newAppointment} from '../../_dev/populate/appointments';
import cancelAppointment from '../appointments/cancel';
import invoke from '../invoke';
import timeSlotFromString from '../../../ui/settings/timeSlotFromString';
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

const slotOrder = weekSlotsCyclicOrder(0);

const findNextAvailable = async (
	userId,
	after,
	durationInMinutes,
	givenConstraints = undefined,
) => {
	const duration = durationInMinutes * units.minute;

	const week: Array<[number, number]> = [[0, units.week + duration]];

	const constraints =
		givenConstraints === undefined
			? week
			: Array.from(
					nonOverlappingIntersection(
						week,
						map(
							({beginModuloWeek, endModuloWeek}) => [
								beginModuloWeek,
								endModuloWeek,
							],
							sorted(slotOrder, givenConstraints),
						),
					),
			  );

	const result = await invoke(next, {userId}, [after, duration, constraints]);

	return result === null ? null : dropId(result);
};

server(__filename, () => {
	it('starts with complete availability', async () => {
		const userId = randomUserId();

		assert.deepEqual(await Availability.findOneAsync(), undefined);

		const actual = await findNextAvailable(userId, new Date(), 1);
		const expected = dropId(initialSlot(userId));

		assert.deepEqual(actual, expected);
	});

	it('stays with complete availability', async () => {
		const userId = randomUserId();

		const now = new Date();

		const appointmentId = await bookSlot(userId, now, addMinutes(now, 15));

		await invoke(cancelAppointment, {userId}, [appointmentId, '', '']);

		const actual = await findNextAvailable(userId, now, 1);

		const expected = dropId(initialSlot(userId));

		assert.deepEqual(actual, expected);
	});

	it('can find next available slot', async () => {
		const userId = randomUserId();

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
		const userId = randomUserId();

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

	it('returns null when no slots are large enough', async () => {
		const userId = randomUserId();

		const now = new Date();

		await bookSlot(userId, addMinutes(now, 1), addMinutes(now, 16));

		const actual = await findNextAvailable(userId, now, 61, [
			timeSlotFromString('1 10 1 11'),
		]);

		const expected = null;

		assert.deepEqual(actual, expected);
	});

	it('respects time slots constraints', async () => {
		const userId = randomUserId();

		const now = startOfDay(someDateAtGivenDayOfWeek(1));

		await bookSlot(userId, addMinutes(now, 60), addMinutes(now, 90));

		const actual1 = await findNextAvailable(userId, now, 15, [
			timeSlotFromString('1 0 1 1'),
		]);

		const expected1 = {
			...slot(beginningOfTime(), addMinutes(now, 60), 0),
			owner: userId,
		};

		assert.deepEqual(actual1, expected1);

		const actual2 = await findNextAvailable(userId, now, 90, [
			timeSlotFromString('1 0 1 3'),
		]);

		const expected2 = {
			...slot(addMinutes(now, 90), endOfTime(), 0),
			owner: userId,
		};

		assert.deepEqual(actual2, expected2);

		const actual3 = await findNextAvailable(userId, now, 91, [
			timeSlotFromString('1 0 1 3'),
		]);

		assert.deepEqual(actual3, expected2);
	});

	it('respects time slots constraints (more complex)', async () => {
		const userId = randomUserId();

		const now = startOfDay(someDateAtGivenDayOfWeek(1));

		await bookSlot(userId, addMinutes(now, 60), addMinutes(now, 90));
		await bookSlot(userId, addMinutes(now, 300), addMinutes(now, 301));

		const actual1 = await findNextAvailable(userId, now, 15, [
			timeSlotFromString('1 0 1 1'),
		]);

		const expected1 = {
			...slot(beginningOfTime(), addMinutes(now, 60), 0),
			owner: userId,
		};

		assert.deepEqual(actual1, expected1);

		const actual2 = await findNextAvailable(userId, now, 90, [
			timeSlotFromString('1 0 1 3'),
		]);

		const expected2 = {
			...slot(addMinutes(now, 90), addMinutes(now, 300), 0),
			owner: userId,
		};

		assert.deepEqual(actual2, expected2);

		const actual3 = await findNextAvailable(userId, now, 91, [
			timeSlotFromString('1 0 1 3'),
		]);

		const expected3 = {
			...slot(addMinutes(now, 301), endOfTime(), 0),
			owner: userId,
		};

		assert.deepEqual(actual3, expected3);
	});
});
