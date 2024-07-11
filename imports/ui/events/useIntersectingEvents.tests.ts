import {renderHook, waitFor} from '@testing-library/react';

import {assert} from 'chai';

import {addMilliseconds} from 'date-fns';

import {list} from '@iterable-iterator/list';
import {map} from '@iterable-iterator/map';

import {client, randomPassword, randomUserId} from '../../_test/fixtures';
import createUserWithPassword from '../../api/user/createUserWithPassword';
import loginWithPassword from '../../api/user/loginWithPassword';
import call from '../../api/endpoint/call';
import {newAppointmentFormData} from '../../api/_dev/populate/appointments';

import appointmentsSchedule from '../../api/endpoint/appointments/schedule';

import {beginningOfTime, endOfTime} from '../../lib/datetime';
import appointmentsCancel from '../../api/endpoint/appointments/cancel';

import useIntersectingEvents from './useIntersectingEvents';

client(__filename, () => {
	it('should render when logged out', async () => {
		const {result} = renderHook(() =>
			useIntersectingEvents(beginningOfTime(), endOfTime(), {}, {}, []),
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
			useIntersectingEvents(beginningOfTime(), endOfTime(), {}, {}, []),
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
			useIntersectingEvents(
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

		assert.deepEqual(
			list(map(({begin, end}) => ({begin, end}), result.current.results)),
			[{begin, end}],
		);
	});

	it('should handle empty intervals', async () => {
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

		const {result} = renderHook(() =>
			useIntersectingEvents(endOfTime(), beginningOfTime(), {}, {}, []),
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

	it('should react to changes', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);

		const {result} = renderHook(() =>
			useIntersectingEvents(
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

		assert.deepEqual(
			list(map(({begin, end}) => ({begin, end}), result.current.results)),
			[{begin, end}],
		);

		await call(appointmentsCancel, appointmentId, '', '');

		await waitFor(() => {
			assert(result.current.results[0]!.isCancelled);
		});

		assert.deepEqual(
			list(
				map(
					({begin, end, isCancelled}) => ({begin, end, isCancelled}),
					result.current.results,
				),
			),
			[{begin, end, isCancelled: true}],
		);
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

		await call(
			appointmentsSchedule,
			newAppointmentFormData({
				datetime,
				duration: 1,
			}),
		);

		const begin = datetime;
		const end = addMilliseconds(datetime, duration);

		const {result} = renderHook(() =>
			useIntersectingEvents(
				addMilliseconds(begin, 1),
				addMilliseconds(end, 1),
				{},
				{sort: {begin: 1}},
				[],
			),
		);

		await waitFor(() => {
			assert(!result.current.loading);
		});

		assert.deepEqual(
			list(map(({begin, end}) => ({begin, end}), result.current.results)),
			[{begin, end}],
		);
	});
});
