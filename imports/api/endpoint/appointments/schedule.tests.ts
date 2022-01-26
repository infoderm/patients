// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Random} from 'meteor/random';

import {dropIds, server} from '../../../test/fixtures';

import {beginningOfTime, endOfTime} from '../../../util/datetime';

import {Appointments} from '../../collection/appointments';
import {Availability} from '../../collection/availability';
import {newAppointment} from '../../_dev/populate/appointments';

import {slot} from '../../availability';

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
