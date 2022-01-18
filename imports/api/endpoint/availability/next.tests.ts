// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';

import addMinutes from 'date-fns/addMinutes';

import scheduleAppointment from '../appointments/schedule';
import cancelAppointment from '../appointments/cancel';

import invoke from '../invoke';

import {Consultations} from '../../collection/consultations.mock';
// eslint-disable-next-line import/no-unassigned-import
import '../../collection/appointments.mock';
import {Availability} from '../../collection/availability.mock';
import {units} from '../../duration';
import {initialSlot, slot} from '../../availability';
import {endOfTime} from '../../../util/datetime';
import next from './next';

const bookSlot = async (owner, begin, end) => {
	const fields = Factory.tree('appointment', {
		datetime: begin,
		duration: end - begin,
	});

	fields.patient._id = '?'; // TODO temporary hack

	const {_id} = await invoke(scheduleAppointment, {userId: owner}, [fields]);

	return _id;
};

if (Meteor.isServer) {
	describe('endpoint', () => {
		describe('availability', () => {
			describe('next', () => {
				beforeEach(() => {
					Consultations.remove({});
					Availability.remove({});
				});

				it('starts with complete availability', async () => {
					const userId = Random.id();

					const invocation = {userId};

					const after = new Date();

					const duration = 1;

					const week: Array<[number, number]> = [[0, units.week + duration]];

					const constraints = week;

					const result = await invoke(next, invocation, [
						after,
						duration,
						constraints,
					]);

					assert.deepEqual(result, initialSlot(userId));
				});

				it('stays with complete availability', async () => {
					const userId = Random.id();

					const invocation = {userId};

					const now = new Date();

					const appointmentId = await bookSlot(
						userId,
						now,
						addMinutes(now, 15),
					);

					await invoke(cancelAppointment, invocation, [appointmentId, '', '']);

					const after = now;

					const duration = 1;

					const week: Array<[number, number]> = [[0, units.week + duration]];

					const constraints = week;

					const actual = await invoke(next, invocation, [
						after,
						duration,
						constraints,
					]);
					delete actual._id;
					const expected = initialSlot(userId);
					delete expected._id;

					assert.deepEqual(actual, expected);
				});

				it('can find next available slot', async () => {
					const userId = Random.id();

					const invocation = {userId};

					const now = new Date();

					await bookSlot(userId, now, addMinutes(now, 15));

					const after = now;

					const duration = 1;

					const week: Array<[number, number]> = [[0, units.week + duration]];

					const constraints = week;

					const actual = await invoke(next, invocation, [
						after,
						duration,
						constraints,
					]);
					delete actual._id;
					const expected = {
						...slot(addMinutes(now, 15), endOfTime(), 0),
						owner: userId,
					};

					assert.deepEqual(actual, expected);
				});
			});
		});
	});
}
