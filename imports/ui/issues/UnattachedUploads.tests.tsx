import {assert} from 'chai';

import React from 'react';

import {BrowserRouter} from 'react-router-dom';

import {faker} from '@faker-js/faker';

import {map} from '@iterable-iterator/map';
import {range} from '@iterable-iterator/range';

import {client, randomPassword, randomUserId} from '../../_test/fixtures';
import {render as _render, waitFor} from '../../_test/react';

import createUserWithPasswordAndLogin from '../../api/user/createUserWithPasswordAndLogin';

import {newUpload} from '../../api/_dev/populate/uploads';
import {newPatientFormData} from '../../api/_dev/populate/patients';
import {newConsultationFormData} from '../../api/_dev/populate/consultations';

import {Uploads} from '../../api/uploads';

import call from '../../api/endpoint/call';
import patientsInsert from '../../api/endpoint/patients/insert';
import attachToPatient from '../../api/endpoint/patients/attach';
import detachFromPatient from '../../api/endpoint/patients/detach';
import consultationsInsert from '../../api/endpoint/consultations/insert';
import attachToConsultation from '../../api/endpoint/consultations/attach';
import detachFromConsultation from '../../api/endpoint/consultations/detach';

import DateTimeLocalizationProvider from '../i18n/DateTimeLocalizationProvider';

import UnattachedUploads from './UnattachedUploads';

const textNoIssues = 'All uploads are attached to something :)';

const render = (children: React.ReactNode) =>
	_render(children, {
		wrapper: ({children}: {children: React.ReactNode}) => (
			<DateTimeLocalizationProvider>
				<BrowserRouter>{children}</BrowserRouter>
			</DateTimeLocalizationProvider>
		),
	});

client(__filename, () => {
	it('renders when not logged in', async () => {
		const {findByText} = render(<UnattachedUploads />);
		await findByText(textNoIssues);
	});

	it('renders when there are no issues', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const {findByText} = render(<UnattachedUploads />);

		await findByText(textNoIssues);
	});

	it('rerenders when a new issue is created', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const {findByRole, findByText} = render(<UnattachedUploads />);

		await findByText(textNoIssues);

		const name = faker.string.uuid();

		await newUpload(undefined, {name});

		await findByRole('img', {name});
	});

	it('rerenders when an upload is deleted', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const name = faker.string.uuid();

		const {_id: uploadId} = await newUpload(undefined, {name});

		const {findByRole, findByText} = render(<UnattachedUploads />);

		await findByRole('img', {name});

		Uploads.remove({_id: uploadId});

		await findByText(textNoIssues);
	});

	it('rerenders when an upload is attached to a patient', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const name = faker.string.uuid();

		const patientId = await call(patientsInsert, newPatientFormData());

		const {_id: uploadId} = await newUpload(undefined, {name});

		const {findByRole, findByText} = render(<UnattachedUploads />);

		await findByRole('img', {name});

		await call(attachToPatient, patientId, uploadId);

		await findByText(textNoIssues);
	});

	it('rerenders when an upload is attached to a consultation', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const name = faker.string.uuid();

		const patientId = await call(patientsInsert, newPatientFormData());
		const {insertedId: consultationId} = await call(
			consultationsInsert,
			newConsultationFormData({patientId}),
		);

		const {_id: uploadId} = await newUpload(undefined, {name});

		const {findByRole, findByText} = render(<UnattachedUploads />);

		await findByRole('img', {name});

		await call(attachToConsultation, consultationId, uploadId);

		await findByText(textNoIssues);
	});

	it('rerenders when an upload is detached from a patient', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const name = faker.string.uuid();

		const patientId = await call(patientsInsert, newPatientFormData());
		const {_id: uploadId} = await newUpload(undefined, {name});
		await call(attachToPatient, patientId, uploadId);

		const {findByRole, findByText} = render(<UnattachedUploads />);

		await findByText(textNoIssues);

		await call(detachFromPatient, patientId, uploadId);

		await findByRole('img', {name});
	});

	it('rerenders when an upload is detached from a consultation', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const name = faker.string.uuid();

		const patientId = await call(patientsInsert, newPatientFormData());
		const {insertedId: consultationId} = await call(
			consultationsInsert,
			newConsultationFormData({patientId}),
		);
		const {_id: uploadId} = await newUpload(undefined, {name});
		await call(attachToConsultation, consultationId, uploadId);

		const {findByRole, findByText} = render(<UnattachedUploads />);

		await findByText(textNoIssues);

		await call(detachFromConsultation, consultationId, uploadId);

		await findByRole('img', {name});
	});

	it('paginates beyond 10 issues', async () => {
		const {setupUser} = await import('../../../test/app/client/fixtures');
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const n = 13;

		await Promise.all(
			map(async (i: number) => {
				const name = `img-${i}.png`;
				return newUpload(undefined, {name, type: 'image/png'});
			}, range(n)),
		);

		const {findByRole, getAllByRole} = render(<UnattachedUploads />);

		const {user} = setupUser();

		await user.click(await findByRole('link', {name: 'Page 2'}));

		await waitFor(() => {
			const listed = getAllByRole('img', {name: /^img-\d+\.png$/});
			assert.lengthOf(listed, n - 10);
		});
	});

	it('paginates beyond 10 issues (empty)', async () => {
		const {setupUser} = await import('../../../test/app/client/fixtures');
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const n = 10;

		await Promise.all(
			map(async (i: number) => {
				const name = `file-${i}.pdf`;
				return newUpload(undefined, {name, type: 'application/pdf'});
			}, range(n)),
		);

		const {findByRole, findByText} = render(<UnattachedUploads />);

		const {user} = setupUser();

		await user.click(await findByRole('link', {name: 'Page 2'}));

		await findByText('Nothing to see on page 2.');
	});
});
