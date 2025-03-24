import {assert} from 'chai';

import React from 'react';

import {BrowserRouter} from 'react-router-dom';

import {faker} from '@faker-js/faker';

import {list} from '@iterable-iterator/list';
import {map} from '@iterable-iterator/map';
import {range} from '@iterable-iterator/range';

import {client, randomPassword, randomUserId} from '../../_test/fixtures';
import {render as _render, renderHook, waitFor} from '../../_test/react';

import createUserWithPasswordAndLogin from '../../api/user/createUserWithPasswordAndLogin';

import {newPatientFormData} from '../../api/_dev/populate/patients';

import call from '../../api/endpoint/call';
import patientsInsert from '../../api/endpoint/patients/insert';

import DateTimeLocalizationProvider from '../i18n/DateTimeLocalizationProvider';

import {
	type FormattedLine,
	formattedLine,
	normalizedLine,
} from '../../api/string';
import {type PatientDocument} from '../../api/collection/patients';
import {deleteDoctor, renameDoctor, useDoctor} from '../../api/doctors';

import DoctorsWithNonAlphabeticalSymbols from './DoctorsWithNonAlphabeticalSymbols';

const textNoIssues = 'All doctors are made of alphabetical symbols only :)';
const patientLinkName = ({
	firstname,
	lastname,
}: Pick<PatientDocument, 'firstname' | 'lastname'>) => {
	return `${lastname} ${firstname}`;
};

const doctorLinkName = (displayName: FormattedLine, patientCount: number) =>
	`Dr ${displayName} soigne ${patientCount} patients`;

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
		const {findByText} = render(<DoctorsWithNonAlphabeticalSymbols />);
		await findByText(textNoIssues);
	});

	it('renders when there are no issues', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const {findByText} = render(<DoctorsWithNonAlphabeticalSymbols />);

		await findByText(textNoIssues);
	});

	it('rerenders when a new issue is created', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const {findByRole, findByText} = render(
			<DoctorsWithNonAlphabeticalSymbols />,
		);

		await findByText(textNoIssues);

		const displayName = '@#$!';

		const doctor = {
			displayName: formattedLine(displayName),
			name: normalizedLine(displayName),
		};

		const patient = newPatientFormData({
			doctors: [doctor],
		});

		await call(patientsInsert, patient);

		await findByRole('link', {name: doctorLinkName(doctor.displayName, 1)});
		await findByRole('link', {name: patientLinkName(patient)});
	});

	it('rerenders when a doctor is renamed to a name without issue', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const displayName = '@#$!';

		const doctor = {
			displayName: formattedLine(displayName),
			name: normalizedLine(displayName),
		};

		const patient = newPatientFormData({
			doctors: [doctor],
		});

		await call(patientsInsert, patient);

		const {result} = renderHook(() => useDoctor(doctor.name, []));

		const {findByRole, findByText} = render(
			<DoctorsWithNonAlphabeticalSymbols />,
		);

		await findByRole('link', {name: doctorLinkName(doctor.displayName, 1)});
		await findByRole('link', {name: patientLinkName(patient)});

		await waitFor(() => {
			assert(!result.current.loading);
		});

		await call(
			renameDoctor,
			result.current.item!._id,
			`${faker.person.lastName()} ${faker.person.firstName()}`,
		);

		await findByText(textNoIssues);
	});

	it('rerenders when a doctor is renamed to a name with issue', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const displayName = `${faker.person.lastName()} ${faker.person.firstName()}`;

		const doctor = {
			displayName: formattedLine(displayName),
			name: normalizedLine(displayName),
		};

		const patient = newPatientFormData({
			doctors: [doctor],
		});

		await call(patientsInsert, patient);

		const {result} = renderHook(() => useDoctor(doctor.name, []));

		const {findByRole, findByText} = render(
			<DoctorsWithNonAlphabeticalSymbols />,
		);

		await findByText(textNoIssues);

		await waitFor(() => {
			assert(!result.current.loading);
		});

		const nameWithIssue = '@#$!';

		await call(renameDoctor, result.current.item!._id, nameWithIssue);

		await findByRole('link', {
			name: doctorLinkName(formattedLine(nameWithIssue), 1),
		});
		await findByRole('link', {name: patientLinkName(patient)});
	});

	it('rerenders when a doctor is deleted', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const displayName = '@#$!';

		const doctor = {
			displayName: formattedLine(displayName),
			name: normalizedLine(displayName),
		};

		const patient = newPatientFormData({
			doctors: [doctor],
		});

		await call(patientsInsert, patient);

		const {result} = renderHook(() => useDoctor(doctor.name, []));

		const {findByRole, findByText} = render(
			<DoctorsWithNonAlphabeticalSymbols />,
		);

		await findByRole('link', {name: doctorLinkName(doctor.displayName, 1)});
		await findByRole('link', {name: patientLinkName(patient)});

		await waitFor(() => {
			assert(!result.current.loading);
		});

		await call(deleteDoctor, result.current.item!._id);

		await findByText(textNoIssues);
	});

	it('paginates beyond 10 issues', async () => {
		const {setupUser} = await import('../../../test/app/client/fixtures');
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const n = 13;

		await call(
			patientsInsert,
			newPatientFormData({
				doctors: list(
					map(
						(i: number) => ({
							displayName: formattedLine(`#${i}`),
							name: normalizedLine(`#${i}`),
						}),
						range(n),
					),
				),
			}),
		);

		const {findByRole, getAllByRole} = render(
			<DoctorsWithNonAlphabeticalSymbols />,
		);

		const {user} = setupUser();

		await user.click(await findByRole('link', {name: 'Page 2'}));

		await waitFor(() => {
			const listed = getAllByRole('link', {
				name: /^Dr #\d+ soigne \d+ patients$/,
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

		await call(
			patientsInsert,
			newPatientFormData({
				doctors: list(
					map(
						(i: number) => ({
							displayName: formattedLine(`#${i}`),
							name: normalizedLine(`#${i}`),
						}),
						range(n),
					),
				),
			}),
		);

		const {findByRole, findByText} = render(
			<DoctorsWithNonAlphabeticalSymbols />,
		);

		const {user} = setupUser();

		await user.click(await findByRole('link', {name: 'Page 2'}));

		await findByText('Nothing to see on page 2.');
	});
});
