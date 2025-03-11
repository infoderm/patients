import {assert} from 'chai';

import {renderHook, waitFor} from '../../_test/react';

import {
	client,
	randomId,
	randomPassword,
	randomUserId,
} from '../../_test/fixtures';

import createUserWithPasswordAndLogin from '../../api/user/createUserWithPasswordAndLogin';
import {newConsultationFormData} from '../../api/_dev/populate/consultations';
import {newPatientFormData} from '../../api/_dev/populate/patients';
import call from '../../api/endpoint/call';

import patientsInsert from '../../api/endpoint/patients/insert';
import consultationsInsert from '../../api/endpoint/consultations/insert';

import useConsultation from './useConsultation';

client(__filename, () => {
	it('should render when logged out', async () => {
		const consultationId = randomId();
		const {result} = renderHook(() =>
			useConsultation({}, {filter: {_id: consultationId}}, [consultationId]),
		);
		assert.deepEqual(result.current, {
			loading: true,
			found: false,
			fields: {},
		});

		await waitFor(() => {
			assert(!result.current.loading);
		});

		assert.deepEqual(result.current, {
			loading: false,
			found: false,
			fields: {},
		});
	});

	it('should render when logged in', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const consultationId = randomId();
		const {result} = renderHook(() =>
			useConsultation({}, {filter: {_id: consultationId}}, [consultationId]),
		);
		assert.deepEqual(result.current, {
			loading: true,
			found: false,
			fields: {},
		});

		await waitFor(() => {
			assert(!result.current.loading);
		});

		assert.deepEqual(result.current, {
			loading: false,
			found: false,
			fields: {},
		});
	});

	it('should contain fields on load', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const patientAId = await call(
			patientsInsert,
			newPatientFormData({sex: 'female'}),
		);
		const patientBId = await call(
			patientsInsert,
			newPatientFormData({sex: 'male'}),
		);

		await call(
			consultationsInsert,
			newConsultationFormData({patientId: patientAId}),
		);
		await call(
			consultationsInsert,
			newConsultationFormData({patientId: patientBId}),
		);
		const datetime = new Date();

		const {insertedId: consultationId} = await call(
			consultationsInsert,
			newConsultationFormData({
				patientId: patientAId,
				datetime,
				reason: '<reason>',
				done: '<done>',
				todo: '<todo>',
				treatment: '<treatment>',
				next: '<next>',
				more: '<more>',
				price: 123,
				paid: 5,
				book: '4',
			}),
		);
		await call(
			consultationsInsert,
			newConsultationFormData({patientId: patientBId}),
		);

		const {result} = renderHook(() =>
			useConsultation({}, {filter: {_id: consultationId}}, [consultationId]),
		);

		await waitFor(() => {
			assert(!result.current.loading);
		});

		assert(result.current.found);

		assert.deepInclude(result.current.fields, {
			_id: consultationId,
			patientId: patientAId,
			datetime,
			reason: '<reason>',
			done: '<done>',
			todo: '<todo>',
			treatment: '<treatment>',
			next: '<next>',
			more: '<more>',
			price: 123,
			paid: 5,
			book: '4',
		});
	});
});
