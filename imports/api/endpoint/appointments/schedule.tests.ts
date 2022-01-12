// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';

import {Consultations} from '../../collection/consultations.mock';
import {newAppointment} from '../../collection/appointments.mock';
import {Availability} from '../../collection/availability.mock';
import {slot} from '../../availability';
import {beginningOfTime, endOfTime} from '../../../util/datetime';
import {dropIds} from '../../../test/fixtures';

if (Meteor.isServer) {
	describe('endpoint', () => {
		describe('appointments', () => {
			describe('schedule', () => {
				beforeEach(() => {
					Consultations.remove({});
					Availability.remove({});
				});

				it('fills availability', async () => {
					const userId = Random.id();

					await newAppointment({userId});

					const {begin, end} = Consultations.findOne();

					const actual = Availability.find().fetch();

					assert.deepEqual(dropIds(actual), [
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
		});
	});
}
