// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Random} from 'meteor/random';

import {Appointments, newAppointment} from '../../collection/appointments.mock';
import {Availability} from '../../collection/availability.mock';
import {slot} from '../../availability';
import {beginningOfTime, endOfTime} from '../../../util/datetime';
import {dropIds, server} from '../../../test/fixtures';

server(__filename, () => {
	it('fills availability', async () => {
		const userId = Random.id();

		await newAppointment({userId});

		const {begin, end} = Appointments.findOne();

		const actual = Availability.find().fetch();

		assert.sameDeepMembers(dropIds(actual), [
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
