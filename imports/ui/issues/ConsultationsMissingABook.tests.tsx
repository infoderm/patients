import {assert} from 'chai';

import React from 'react';

import {BrowserRouter} from 'react-router-dom';

import {list} from '@iterable-iterator/list';
import {map} from '@iterable-iterator/map';
import {range} from '@iterable-iterator/range';

import {client, randomPassword, randomUserId} from '../../_test/fixtures';
import {render as _render, waitFor} from '../../_test/react';

import createUserWithPasswordAndLogin from '../../api/user/createUserWithPasswordAndLogin';

import {type PatientDocument} from '../../api/collection/patients';
import {newPatientFormData} from '../../api/_dev/populate/patients';
import {newConsultationFormData} from '../../api/_dev/populate/consultations';

import call from '../../api/endpoint/call';
import patientsInsert from '../../api/endpoint/patients/insert';
import consultationsInsert from '../../api/endpoint/consultations/insert';
import consultationsUpdate from '../../api/endpoint/consultations/update';

import DateTimeLocalizationProvider from '../i18n/DateTimeLocalizationProvider';

import UserThemeProvider from '../UserThemeProvider';

import ConsultationsMissingABook from './ConsultationsMissingABook';

const textNoIssues = 'All consultations have a book :)';

const patientLinkName = ({
	firstname,
	lastname,
}: Pick<PatientDocument, 'firstname' | 'lastname'>) => {
	return `${lastname} ${firstname}`;
};

const render = (children: React.ReactNode) =>
	_render(children, {
		wrapper: ({children}: {children: React.ReactNode}) => (
			<UserThemeProvider>
				<DateTimeLocalizationProvider>
					<BrowserRouter>{children}</BrowserRouter>
				</DateTimeLocalizationProvider>
			</UserThemeProvider>
		),
	});

client(__filename, () => {
	it('renders when not logged in', async () => {
		const {findByText} = render(<ConsultationsMissingABook />);
		await findByText(textNoIssues);
	});

	it('renders when there are no issues', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const {findByText} = render(<ConsultationsMissingABook />);

		await findByText(textNoIssues);
	});

	it('rerenders when a new issue is created', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const {findByRole, findByText} = render(<ConsultationsMissingABook />);

		await findByText(textNoIssues);

		const patient = newPatientFormData();
		const patientId = await call(patientsInsert, patient);
		const consultation = newConsultationFormData({
			patientId,
			book: '',
		});
		await call(consultationsInsert, consultation);

		await findByRole('link', {name: patientLinkName(patient)});
	});

	it('rerenders when an issue is fixed', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const patient = newPatientFormData();
		const patientId = await call(patientsInsert, patient);
		const consultation = newConsultationFormData({
			patientId,
			book: '',
		});
		const {insertedId: consultationId} = await call(
			consultationsInsert,
			consultation,
		);

		const {findByRole, findByText} = render(<ConsultationsMissingABook />);

		await findByRole('link', {name: patientLinkName(patient)});

		await call(consultationsUpdate, consultationId, {book: 'book-name'});

		await findByText(textNoIssues);
	});

	it('paginates beyond 10 issues', async () => {
		const {setupUser} = await import('../../../test/app/client/fixtures');
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const n = 13;

		const patient = newPatientFormData();
		const patientId = await call(patientsInsert, patient);

		await Promise.all(
			list(
				map(
					async (_: number) =>
						call(
							consultationsInsert,
							newConsultationFormData({
								patientId,
								book: '',
							}),
						),
					range(n),
				),
			),
		);

		const {findByRole, getAllByRole} = render(<ConsultationsMissingABook />);

		const {user} = setupUser();

		await user.click(await findByRole('link', {name: 'Page 2'}));

		await waitFor(() => {
			const listed = getAllByRole('link', {
				name: patientLinkName(patient),
			});
			assert.lengthOf(listed, n - 10);
		});
	});

	it('paginates beyond 10 issues (empty)', async () => {
		const {setupUser} = await import('../../../test/app/client/fixtures');
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const n = 10;

		const patient = newPatientFormData();
		const patientId = await call(patientsInsert, patient);

		await Promise.all(
			list(
				map(
					async (_: number) =>
						call(
							consultationsInsert,
							newConsultationFormData({
								patientId,
								book: '',
							}),
						),
					range(n),
				),
			),
		);

		const {findByRole, findByText} = render(<ConsultationsMissingABook />);

		const {user} = setupUser();

		await user.click(await findByRole('link', {name: 'Page 2'}));

		await findByText('Nothing to see on page 2.');
	});
});
