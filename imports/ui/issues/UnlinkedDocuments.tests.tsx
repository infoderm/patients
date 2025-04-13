import {assert} from 'chai';

import React from 'react';

import {BrowserRouter} from 'react-router-dom';

import {list} from '@iterable-iterator/list';
import {map} from '@iterable-iterator/map';
import {sum} from '@iterable-iterator/reduce';
import {len} from '@functional-abstraction/operator';

import {client, randomPassword, randomUserId} from '../../_test/fixtures';
import {render as _render, waitFor} from '../../_test/react';

import createUserWithPasswordAndLogin from '../../api/user/createUserWithPasswordAndLogin';

import {newPatientFormData} from '../../api/_dev/populate/patients';
import {
	exampleHealthoneLab,
	exampleMedidocReport,
	exampleHealthoneReport,
} from '../../api/_dev/populate/documents';

import call from '../../api/endpoint/call';
import patientsInsert from '../../api/endpoint/patients/insert';
import documentsInsert from '../../api/endpoint/documents/insert';
import documentsLink from '../../api/endpoint/documents/link';

import DateTimeLocalizationProvider from '../i18n/DateTimeLocalizationProvider';

import UserThemeProvider from '../UserThemeProvider';

import UnlinkedDocuments from './UnlinkedDocuments';

const textNoIssues = 'No rows';

const documentLinkName = (_id: string) => `Open document #${_id} in New Tab`;

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
		const {findByText} = render(<UnlinkedDocuments />);
		await findByText(textNoIssues);
	});

	it('renders when there are no issues', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const {findByText} = render(<UnlinkedDocuments />);

		await findByText(textNoIssues);
	});

	it('rerenders when a new issue is created', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const {findByRole, findByText} = render(<UnlinkedDocuments />);

		await findByText(textNoIssues);

		const documentIds = await call(documentsInsert, {
			array: new TextEncoder().encode(exampleMedidocReport.contents),
		});

		await Promise.all(
			list(
				map(
					async (documentId: string) =>
						findByRole('link', {name: documentLinkName(documentId)}),
					documentIds,
				),
			),
		);
	});

	it('rerenders when an issue is fixed', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const documentIds = await call(documentsInsert, {
			array: new TextEncoder().encode(exampleMedidocReport.contents),
		});

		const {findByRole, findByText} = render(<UnlinkedDocuments />);

		await Promise.all(
			list(
				map(
					async (documentId: string) =>
						findByRole('link', {name: documentLinkName(documentId)}),
					documentIds,
				),
			),
		);

		const patient = newPatientFormData();
		const patientId = await call(patientsInsert, patient);

		await Promise.all(
			list(
				map(
					async (documentId: string) =>
						call(documentsLink, documentId, patientId),
					documentIds,
				),
			),
		);

		await findByText(textNoIssues);
	});

	it('paginates beyond 10 issues', async () => {
		const {setupUser} = await import('../../../test/app/client/fixtures');
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const inserted = await Promise.all(
			list(
				map(
					async ({contents}) =>
						call(documentsInsert, {
							array: new TextEncoder().encode(contents),
						}),
					[exampleHealthoneReport, exampleHealthoneLab, exampleMedidocReport],
				),
			),
		);

		const n = sum(map(len, inserted));
		assert.strictEqual(n, 11);

		const {findByRole, getAllByRole} = render(<UnlinkedDocuments />);

		const {user} = setupUser();

		await user.click(await findByRole('link', {name: 'Page 2'}));

		await waitFor(() => {
			const listed = getAllByRole('link', {
				name: /^open document #[^ ]+ in new tab$/i,
			});
			assert.lengthOf(listed, n - 10);
		});
	});

	it('paginates beyond 10 issues (empty)', async () => {
		const {setupUser} = await import('../../../test/app/client/fixtures');
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const inserted = await Promise.all(
			list(
				map(
					async ({contents}) =>
						call(documentsInsert, {
							array: new TextEncoder().encode(contents),
						}),
					[exampleHealthoneReport, exampleHealthoneLab],
				),
			),
		);

		const n = sum(map(len, inserted));
		assert.strictEqual(n, 10);

		const {findByRole, findByText} = render(<UnlinkedDocuments />);

		const {user} = setupUser();

		await user.click(await findByRole('link', {name: 'Page 2'}));

		await findByText('No rows');
	});
});
