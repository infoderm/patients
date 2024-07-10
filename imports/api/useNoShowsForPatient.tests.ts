import {renderHook, waitFor} from '@testing-library/react';
import {range} from '@iterable-iterator/range';

import {assert} from 'chai';

import {startOfTomorrow, startOfYesterday} from 'date-fns';

import {client, randomPassword, randomUserId} from '../_test/fixtures';

import createUserWithPassword from './user/createUserWithPassword';
import loginWithPassword from './user/loginWithPassword';
import call from './endpoint/call';
import {newAppointmentFormData} from './_dev/populate/appointments';

import appointmentsSchedule from './endpoint/appointments/schedule';
import appointmentsCancel from './endpoint/appointments/cancel';
import randomId from './randomId';
import useNoShowsForPatient from './useNoShowsForPatient';
import {newPatientFormData} from './_dev/populate/patients';
import patientsInsert from './endpoint/patients/insert';
import beginConsultation from './endpoint/appointments/beginConsultation';
import appointmentsReschedule from './endpoint/appointments/reschedule';

client(__filename, () => {
	it('should render when logged out', async () => {
		const patientId = randomId();
		const {result} = renderHook(() => useNoShowsForPatient(patientId));
		assert.deepEqual(result.current, {
			loading: true,
			found: false,
			value: undefined,
		});

		await waitFor(() => {
			assert(!result.current.loading);
		});

		assert.deepEqual(result.current, {
			loading: false,
			found: false,
			value: undefined,
		});
	});

	it('should render when logged in', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);

		const patientId = randomId();
		const {result} = renderHook(() => useNoShowsForPatient(patientId));
		assert.deepEqual(result.current, {
			loading: true,
			found: false,
			value: undefined,
		});

		await waitFor(() => {
			assert(!result.current.loading);
		});

		assert.deepEqual(result.current, {
			loading: false,
			found: true,
			value: 0,
		});
	});

	it('should have aggregate on load', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);

		const patientId = await call(patientsInsert, newPatientFormData());

		const yesterday = startOfYesterday();
		const tomorrow = startOfTomorrow();

		for (const _ of range(3)) {
			// eslint-disable-next-line no-await-in-loop
			await call(
				appointmentsSchedule,
				newAppointmentFormData({
					datetime: yesterday,
					patient: {_id: patientId},
				}),
			);
		}

		for (const _ of range(2)) {
			// eslint-disable-next-line no-await-in-loop
			await call(
				appointmentsSchedule,
				newAppointmentFormData({
					datetime: tomorrow,
					patient: {_id: patientId},
				}),
			);
		}

		const {result} = renderHook(() => useNoShowsForPatient(patientId));
		await waitFor(() => {
			assert(!result.current.loading);
		});

		assert.deepEqual(result.current, {
			loading: false,
			found: true,
			value: 3,
		});
	});

	it('should react to changes', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);

		const patientId = await call(patientsInsert, newPatientFormData());

		const otherPatientId = await call(patientsInsert, newPatientFormData());

		const yesterday = startOfYesterday();
		const tomorrow = startOfTomorrow();
		const {result} = renderHook(() => useNoShowsForPatient(patientId));
		await waitFor(() => {
			assert(!result.current.loading);
		});

		assert.deepEqual(result.current, {
			loading: false,
			found: true,
			value: 0,
		});

		const _insertOneNoShow = async () => {
			await call(
				appointmentsSchedule,
				newAppointmentFormData({
					datetime: tomorrow,
					patient: {_id: patientId},
				}),
			);

			const {_id} = await call(
				appointmentsSchedule,
				newAppointmentFormData({
					datetime: yesterday,
					patient: {_id: patientId},
				}),
			);

			await call(
				appointmentsSchedule,
				newAppointmentFormData({
					datetime: tomorrow,
					patient: {_id: patientId},
				}),
			);

			return _id;
		};

		const a = await _insertOneNoShow();

		await waitFor(() => {
			assert.strictEqual(result.current.value, 1);
		});

		const b = await _insertOneNoShow();

		await waitFor(() => {
			assert.strictEqual(result.current.value, 2);
		});

		const c = await _insertOneNoShow();

		await waitFor(() => {
			assert.strictEqual(result.current.value, 3);
		});

		const d = await _insertOneNoShow();

		await waitFor(() => {
			assert.deepEqual(result.current, {
				loading: false,
				found: true,
				value: 4,
			});
		});

		await call(appointmentsReschedule, d, {patient: {_id: otherPatientId}});

		await waitFor(() => {
			assert.strictEqual(result.current.value, 3);
		});

		await call(appointmentsCancel, b, '', '');

		await waitFor(() => {
			assert.strictEqual(result.current.value, 2);
		});

		await call(beginConsultation, a);

		await waitFor(() => {
			assert.strictEqual(result.current.value, 1);
		});

		await call(appointmentsReschedule, c, {datetime: tomorrow, duration: 1});

		await waitFor(() => {
			assert.strictEqual(result.current.value, 0);
		});
	});
});
