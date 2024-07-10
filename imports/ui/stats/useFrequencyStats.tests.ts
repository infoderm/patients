import {renderHook, waitFor} from '@testing-library/react';

import {assert} from 'chai';

import {client, randomPassword, randomUserId} from '../../_test/fixtures';
import createUserWithPassword from '../../api/user/createUserWithPassword';
import loginWithPassword from '../../api/user/loginWithPassword';
import patientsInsert from '../../api/endpoint/patients/insert';
import call from '../../api/endpoint/call';
import {newPatientFormData} from '../../api/_dev/populate/patients';
import {newConsultationFormData} from '../../api/_dev/populate/consultations';
import consultationsInsert from '../../api/endpoint/consultations/insert';
import patientsRemove from '../../api/endpoint/patients/remove';
import consultationsRemove from '../../api/endpoint/consultations/remove';

import patientsUpdate from '../../api/endpoint/patients/update';

import useFrequencyStats from './useFrequencyStats';

client(__filename, () => {
	it('should render when logged out', async () => {
		const {result} = renderHook(() => useFrequencyStats());
		assert.deepEqual(result.current, {
			loading: true,
			total: undefined,
			count: undefined,
		});

		await waitFor(() => {
			assert(!result.current.loading);
		});

		assert.deepEqual(result.current, {
			loading: false,
			total: undefined,
			count: undefined,
		});
	});

	it('should render when logged in', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);

		const {result} = renderHook(() => useFrequencyStats());
		assert.deepEqual(result.current, {
			loading: true,
			total: undefined,
			count: undefined,
		});

		await waitFor(() => {
			assert(!result.current.loading);
		});

		assert.deepEqual(result.current, {
			loading: false,
			total: 0,
			count: [{}],
		});
	});

	it('should have aggregate on load', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);

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
		await call(
			consultationsInsert,
			newConsultationFormData({patientId: patientAId}),
		);
		await call(
			consultationsInsert,
			newConsultationFormData({patientId: patientBId}),
		);

		const {result} = renderHook(() => useFrequencyStats());

		await waitFor(() => {
			assert(!result.current.loading);
		});

		assert.deepEqual(result.current, {
			loading: false,
			total: 4,
			count: [{}, {}, {female: 1, male: 1}],
		});
	});

	it('should react to changes', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);

		const {result} = renderHook(() => useFrequencyStats());
		assert.deepEqual(result.current, {
			loading: true,
			total: undefined,
			count: undefined,
		});

		await waitFor(() => {
			assert(!result.current.loading);
		});

		assert.deepEqual(result.current, {
			loading: false,
			total: 0,
			count: [{}],
		});

		const patientAId = await call(
			patientsInsert,
			newPatientFormData({sex: 'female'}),
		);

		await waitFor(() => {
			assert.notDeepEqual(result.current.count, [{}]);
		});

		assert.deepEqual(result.current, {
			loading: false,
			total: 0,
			count: [{female: 1}],
		});

		const patientBId = await call(
			patientsInsert,
			newPatientFormData({sex: undefined}),
		);

		await waitFor(() => {
			assert.notDeepEqual(result.current.count, [{female: 1}]);
		});

		assert.deepEqual(result.current, {
			loading: false,
			total: 0,
			count: [{female: 1, undefined: 1}],
		});

		await call(
			consultationsInsert,
			newConsultationFormData({patientId: patientAId}),
		);

		await waitFor(() => {
			assert.strictEqual(result.current.total, 1);
		});

		assert.deepEqual(result.current, {
			loading: false,
			total: 1,
			count: [{undefined: 1}, {female: 1}],
		});

		const {insertedId: consultationAId} = await call(
			consultationsInsert,
			newConsultationFormData({patientId: patientBId}),
		);
		const {insertedId: consultationBId} = await call(
			consultationsInsert,
			newConsultationFormData({patientId: patientBId}),
		);

		await waitFor(() => {
			assert.strictEqual(result.current.total, 3);
		});

		assert.deepEqual(result.current, {
			loading: false,
			total: 3,
			count: [{}, {female: 1}, {undefined: 1}],
		});

		await call(
			consultationsInsert,
			newConsultationFormData({patientId: patientAId}),
		);

		await waitFor(() => {
			assert.strictEqual(result.current.total, 4);
		});

		assert.deepEqual(result.current, {
			loading: false,
			total: 4,
			count: [{}, {}, {female: 1, undefined: 1}],
		});

		await call(patientsRemove, patientAId);

		await waitFor(() => {
			assert.strictEqual(result.current.total, 2);
		});
		await waitFor(() => {
			assert.deepEqual(result.current.count![0], {});
		});

		assert.deepEqual(result.current, {
			loading: false,
			total: 2,
			count: [{}, {}, {undefined: 1}],
		});

		await call(consultationsRemove, consultationAId);

		await waitFor(() => {
			assert.strictEqual(result.current.total, 1);
		});

		assert.deepEqual(result.current, {
			loading: false,
			total: 1,
			count: [{}, {undefined: 1}, {}],
		});

		await call(consultationsRemove, consultationBId);

		await waitFor(() => {
			assert.strictEqual(result.current.total, 0);
		});

		assert.deepEqual(result.current, {
			loading: false,
			total: 0,
			count: [{undefined: 1}, {}, {}],
		});
	});

	it('should handle `other` patient sex', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);

		const {result} = renderHook(() => useFrequencyStats());

		await call(patientsInsert, newPatientFormData({sex: 'other'}));

		await waitFor(() => {
			assert.notDeepEqual(result.current.count, [{}]);
		});

		assert.deepEqual(result.current, {
			loading: false,
			total: 0,
			count: [{other: 1}],
		});
	});

	it('should handle <empty string> patient sex', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);

		const {result} = renderHook(() => useFrequencyStats());

		await call(patientsInsert, newPatientFormData({sex: ''}));

		await waitFor(() => {
			assert.notDeepEqual(result.current.count, [{}]);
		});

		assert.deepEqual(result.current, {
			loading: false,
			total: 0,
			count: [{'': 1}],
		});
	});

	it('should handle patient sex update', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);

		const {result} = renderHook(() => useFrequencyStats());

		const patientId = await call(
			patientsInsert,
			newPatientFormData({sex: 'male'}),
		);

		await call(consultationsInsert, newConsultationFormData({patientId}));

		await waitFor(() => {
			assert.strictEqual(result.current.total, 1);
		});

		assert.deepEqual(result.current, {
			loading: false,
			total: 1,
			count: [{}, {male: 1}],
		});

		await call(patientsUpdate, patientId, {sex: 'other'});

		await call(consultationsInsert, newConsultationFormData({patientId}));

		await waitFor(() => {
			assert.strictEqual(result.current.total, 2);
		});

		assert.deepEqual(result.current, {
			loading: false,
			total: 2,
			count: [{}, {}, {other: 1}],
		});
	});
});
