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

import UserThemeProvider from '../UserThemeProvider';

import MangledDocuments from './MangledDocuments';

const textNoIssues = 'All documents have been decoded :)';

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

const iso2022kr = [0x1b, 0x24, 0x29, 0x43];

client(__filename, () => {
	it('renders when not logged in', async () => {
		const {findByText} = render(<MangledDocuments />);
		await findByText(textNoIssues);
	});

	it('renders when there are no issues', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const {findByText} = render(<MangledDocuments />);

		await findByText(textNoIssues);
	});

	it('rerenders when a new issue is created', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const {findByRole, findByText} = render(<MangledDocuments />);

		await findByText(textNoIssues);

		const documentIds = await call(documentsInsert, {
			array: Uint8Array.from(iso2022kr),
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
			array: Uint8Array.from(iso2022kr),
		});

		const {findByRole, findByText} = render(<MangledDocuments />);

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
							array: Uint8Array.from([...iso2022kr, i, i]),
						}),
					range(n),
				),
			),
		);

		const {findByRole, getAllByRole} = render(<MangledDocuments />);

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
							array: Uint8Array.from([...iso2022kr, i, i]),
						}),
					range(n),
				),
			),
		);

		const {findByRole, findByText} = render(<MangledDocuments />);

		const {user} = setupUser();

		await user.click(await findByRole('link', {name: 'Page 2'}));

		await findByText('Nothing to see on page 2.');
	});
});
