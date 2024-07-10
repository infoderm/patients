import {renderHook, waitFor} from '@testing-library/react';

import {assert} from 'chai';

import {addMilliseconds} from 'date-fns';

import {
	client,
	dropIds,
	dropOwners,
	randomPassword,
	randomUserId,
} from '../../_test/fixtures';
import createUserWithPassword from '../../api/user/createUserWithPassword';
import loginWithPassword from '../../api/user/loginWithPassword';
import call from '../../api/endpoint/call';
import {newAppointmentFormData} from '../../api/_dev/populate/appointments';

import appointmentsSchedule from '../../api/endpoint/appointments/schedule';

import {beginningOfTime, endOfTime} from '../../lib/datetime';
import {slot} from '../../api/availability';
import appointmentsCancel from '../../api/endpoint/appointments/cancel';

import useAvailability from './useAvailability';

client(__filename, () => {
	it('should render when logged out', async () => {
		const {result} = renderHook(() =>
			useAvailability(beginningOfTime(), endOfTime(), {}, {}, []),
		);
		assert.deepEqual(result.current, {
			loading: true,
			results: [],
		});

		await waitFor(() => {
			assert(!result.current.loading);
		});

		assert.deepEqual(result.current, {
			loading: false,
			results: [],
		});
	});

	it('should render when logged in', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);

		const {result} = renderHook(() =>
			useAvailability(beginningOfTime(), endOfTime(), {}, {}, []),
		);
		assert.deepEqual(result.current, {
			loading: true,
			results: [],
		});

		await waitFor(() => {
			assert(!result.current.loading);
		});

		assert.deepEqual(result.current, {
			loading: false,
			// TODO Should be [{beginningOfTime, endOfTime}]
			results: [],
		});
	});

	it('should have aggregate on load', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);

		const datetime = new Date();
		const duration = 12_345;

		await call(
			appointmentsSchedule,
			newAppointmentFormData({
				datetime,
				duration,
			}),
		);

		const begin = datetime;
		const end = addMilliseconds(datetime, duration);

		const {result} = renderHook(() =>
			useAvailability(
				beginningOfTime(),
				endOfTime(),
				{},
				{sort: {begin: 1}},
				[],
			),
		);

		await waitFor(() => {
			assert(!result.current.loading);
		});

		assert.deepEqual(dropOwners(dropIds(result.current.results)), [
			slot(beginningOfTime(), begin, 0),
			slot(begin, end, 1),
			slot(end, endOfTime(), 0),
		]);
	});

	it('should react to changes', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);

		const {result} = renderHook(() =>
			useAvailability(
				beginningOfTime(),
				endOfTime(),
				{},
				{sort: {begin: 1}},
				[],
			),
		);
		assert.deepEqual(result.current, {
			loading: true,
			results: [],
		});

		await waitFor(() => {
			assert(!result.current.loading);
		});

		assert.deepEqual(result.current, {
			loading: false,
			results: [],
		});

		const datetime = new Date();
		const duration = 12_345;

		const {_id: appointmentId} = await call(
			appointmentsSchedule,
			newAppointmentFormData({
				datetime,
				duration,
			}),
		);

		await waitFor(() => {
			assert.isNotEmpty(result.current.results);
		});

		const begin = datetime;
		const end = addMilliseconds(datetime, duration);

		assert.deepEqual(dropOwners(dropIds(result.current.results)), [
			slot(beginningOfTime(), begin, 0),
			slot(begin, end, 1),
			slot(end, endOfTime(), 0),
		]);

		await call(appointmentsCancel, appointmentId, '', '');

		await waitFor(() => {
			assert.lengthOf(result.current.results, 1);
		});

		assert.deepEqual(dropOwners(dropIds(result.current.results)), [
			slot(beginningOfTime(), endOfTime(), 0),
		]);
	});

	it('should allow to filter by weight', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);

		const datetime = new Date();
		const duration = 12_345;

		await call(
			appointmentsSchedule,
			newAppointmentFormData({
				datetime,
				duration,
			}),
		);

		const begin = datetime;
		const end = addMilliseconds(datetime, duration);

		const {result} = renderHook(() =>
			useAvailability(
				beginningOfTime(),
				endOfTime(),
				{weight: 0},
				{sort: {begin: 1}},
				[],
			),
		);

		await waitFor(() => {
			assert(!result.current.loading);
		});

		assert.deepEqual(dropOwners(dropIds(result.current.results)), [
			slot(beginningOfTime(), begin, 0),
			slot(end, endOfTime(), 0),
		]);
	});

	it('should allow to filter intersection', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);

		const datetime = new Date();
		const duration = 12_345;

		await call(
			appointmentsSchedule,
			newAppointmentFormData({
				datetime,
				duration,
			}),
		);

		const begin = datetime;
		const end = addMilliseconds(datetime, duration);

		const {result} = renderHook(() =>
			useAvailability(
				begin,
				addMilliseconds(end, 1),
				{},
				{sort: {begin: 1}},
				[],
			),
		);

		await waitFor(() => {
			assert(!result.current.loading);
		});

		assert.deepEqual(dropOwners(dropIds(result.current.results)), [
			slot(begin, end, 1),
			slot(end, endOfTime(), 0),
		]);
	});
});
