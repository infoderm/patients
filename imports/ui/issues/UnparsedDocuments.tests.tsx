import {assert} from 'chai';

import React from 'react';

import {BrowserRouter} from 'react-router-dom';

import {list} from '@iterable-iterator/list';
import {map} from '@iterable-iterator/map';
import {range} from '@iterable-iterator/range';

import {client, randomPassword, randomUserId} from '../../_test/fixtures';
import {render as _render, waitFor} from '../../_test/react';

import createUserWithPasswordAndLogin from '../../api/user/createUserWithPasswordAndLogin';

import call from '../../api/endpoint/call';
import documentsInsert from '../../api/endpoint/documents/insert';
import documentsSuperdelete from '../../api/endpoint/documents/superdelete';

import DateTimeLocalizationProvider from '../i18n/DateTimeLocalizationProvider';

import UnparsedDocuments from './UnparsedDocuments';

const textNoIssues = 'All documents have been parsed :)';

const documentLinkName = (_id: string) => `Open document #${_id} in New Tab`;

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
		const {findByText} = render(<UnparsedDocuments />);
		await findByText(textNoIssues);
	});

	it('renders when there are no issues', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const {findByText} = render(<UnparsedDocuments />);

		await findByText(textNoIssues);
	});

	it('rerenders when a new issue is created', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const {findByRole, findByText} = render(<UnparsedDocuments />);

		await findByText(textNoIssues);

		const documentIds = await call(documentsInsert, {
			array: new TextEncoder().encode('ABRACADABRA'),
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
			array: new TextEncoder().encode('ABRACADABRA'),
		});

		const {findByRole, findByText} = render(<UnparsedDocuments />);

		await Promise.all(
			list(
				map(
					async (documentId: string) =>
						findByRole('link', {name: documentLinkName(documentId)}),
					documentIds,
				),
			),
		);

		await Promise.all(
			list(
				map(
					async (documentId: string) => call(documentsSuperdelete, documentId),
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

		const n = 13;

		await Promise.all(
			list(
				map(
					async (i: number) =>
						call(documentsInsert, {
							array: new TextEncoder().encode(`ABRACADABRA-${i}`),
						}),
					range(n),
				),
			),
		);

		const {findByRole, getAllByRole} = render(<UnparsedDocuments />);

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

		const n = 10;

		await Promise.all(
			list(
				map(
					async (i: number) =>
						call(documentsInsert, {
							array: new TextEncoder().encode(`ABRACADABRA-${i}`),
						}),
					range(n),
				),
			),
		);

		const {findByRole, findByText} = render(<UnparsedDocuments />);

		const {user} = setupUser();

		await user.click(await findByRole('link', {name: 'Page 2'}));

		await findByText('Nothing to see on page 2.');
	});
});
