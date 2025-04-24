import {assert} from 'chai';

import React from 'react';

import {BrowserRouter} from 'react-router-dom';

import {faker} from '@faker-js/faker';

import {client, randomUserId} from '../../_test/fixtures';
import {
	render as _render,
	waitForElementToBeRemoved,
	screen,
	within,
} from '../../_test/react';

import DateTimeLocalizationProvider from '../i18n/DateTimeLocalizationProvider';

import UserThemeProvider from '../UserThemeProvider';

import DataGridModelProvider from '../data-grid/DataGridModelProvider';

import DocumentsTable from './DocumentsTable';

const textEmptyTable = 'No rows';

const documentLinkName = (_id: string) => `Open document #${_id} in New Tab`;

const render = (children: React.ReactNode) => {
	const {rerender: _rerender, ...rest} = _render(children, {
		wrapper: ({children}: {children: React.ReactNode}) => (
			<UserThemeProvider>
				<DateTimeLocalizationProvider>
					<BrowserRouter>{children}</BrowserRouter>
				</DateTimeLocalizationProvider>
			</UserThemeProvider>
		),
	});

	const rerender = async (node: React.ReactNode) => {
		_rerender(node);
	};

	return {
		rerender,
		...rest,
	};
};

client(__filename, () => {
	it('works when loading', async () => {
		const {findByRole} = render(
			<DataGridModelProvider>
				<DocumentsTable loading showDeleted items={[]} page={0} pageSize={10} />
			</DataGridModelProvider>,
		);
		await findByRole('progressbar');
	});

	it('works when not loading', async () => {
		const {findByText} = render(
			<DataGridModelProvider>
				<DocumentsTable
					showDeleted
					loading={false}
					items={[]}
					page={0}
					pageSize={10}
				/>
			</DataGridModelProvider>,
		);
		await findByText(textEmptyTable);
	});

	it('handles loading state updates', async () => {
		const {findByText, findByRole, rerender} = render(
			<DataGridModelProvider>
				<DocumentsTable loading showDeleted items={[]} page={0} pageSize={10} />
			</DataGridModelProvider>,
		);

		const loadingTableFeedback = await findByRole('progressbar');

		await Promise.all([
			waitForElementToBeRemoved(loadingTableFeedback),
			rerender(
				<DataGridModelProvider>
					<DocumentsTable
						showDeleted
						loading={false}
						items={[]}
						page={0}
						pageSize={10}
					/>
				</DataGridModelProvider>,
			),
		]);

		const emptyTableFeedback = await findByText(textEmptyTable);

		await Promise.all([
			waitForElementToBeRemoved(emptyTableFeedback),
			rerender(
				<DataGridModelProvider>
					<DocumentsTable
						loading
						showDeleted
						items={[]}
						page={0}
						pageSize={10}
					/>
				</DataGridModelProvider>,
			),
			findByRole('progressbar'),
		]);
	});

	it('displays a `more` menu for each row', async () => {
		const owner = randomUserId();
		const {findAllByRole} = render(
			<DataGridModelProvider>
				<DocumentsTable
					showDeleted
					loading={false}
					items={[
						{
							_id: 'A',
							owner,
							createdAt: faker.date.anytime(),
							source: 'A',
							decoded: 'A',
							parsed: false,
						},
						{
							_id: 'B',
							owner,
							createdAt: faker.date.anytime(),
							source: 'B',
							decoded: 'B',
							parsed: false,
						},
					]}
					page={0}
					pageSize={10}
				/>
			</DataGridModelProvider>,
		);

		assert.lengthOf(await findAllByRole('menuitem', {name: 'more'}), 2);
	});

	it('displays actions and links for a non-deleted row', async () => {
		const {setupUser} = await import('../../../test/app/client/fixtures');
		const owner = randomUserId();
		const {findByRole} = render(
			<DataGridModelProvider>
				<DocumentsTable
					showDeleted
					loading={false}
					items={[
						{
							_id: 'A',
							owner,
							createdAt: faker.date.anytime(),
							source: 'A',
							decoded: 'A',
							parsed: false,
						},
					]}
					page={0}
					pageSize={10}
				/>
			</DataGridModelProvider>,
		);

		const {user} = setupUser();

		await findByRole('link', {name: documentLinkName('A')});

		await user.click(await findByRole('menuitem', {name: 'more'}));

		await Promise.all([
			findByRole('menuitem', {name: 'Download document #A'}),
			findByRole('menuitem', {name: 'Delete document #A'}),
		]);
	});

	it('displays actions and links for a deleted row', async () => {
		const {setupUser} = await import('../../../test/app/client/fixtures');
		const owner = randomUserId();
		const {findByRole} = render(
			<DataGridModelProvider>
				<DocumentsTable
					showDeleted
					loading={false}
					items={[
						{
							_id: 'A',
							owner,
							createdAt: faker.date.anytime(),
							source: 'A',
							decoded: 'A',
							parsed: false,
							deleted: true,
						},
					]}
					page={0}
					pageSize={10}
				/>
			</DataGridModelProvider>,
		);

		const {user} = setupUser();

		await findByRole('link', {name: documentLinkName('A')});

		await user.click(await findByRole('menuitem', {name: 'more'}));

		await Promise.all([
			findByRole('menuitem', {name: 'Download document #A'}),
			findByRole('menuitem', {name: 'Restore document #A'}),
			findByRole('menuitem', {name: 'Delete document #A forever'}),
		]);
	});

	it('displays Datetime filter', async () => {
		const {setupUser} = await import('../../../test/app/client/fixtures');
		const {findByRole} = render(
			<DataGridModelProvider>
				<DocumentsTable
					showDeleted
					loading={false}
					items={[]}
					page={0}
					pageSize={10}
				/>
			</DataGridModelProvider>,
		);

		const {user} = setupUser();

		const column = await findByRole('columnheader', {name: 'Datetime'});

		// NOTE: No need to hover.
		// SEE: https://github.com/mui/mui-x/issues/4644.
		await user.click(await within(column).findByRole('button', {name: 'Menu'}));

		await user.click(await findByRole('menuitem', {name: 'Filter'}));
		await user.unhover(await findByRole('columnheader', {name: 'Datetime'}));

		// NOTE: On Desktop, use `role=button` instead.
		// SEE: https://github.com/mui/mui-x/issues/4644.
		await user.click(await screen.findByRole('textbox', {name: 'Choose date'}));
	});

	it('displays LastVersion filter', async () => {
		const {setupUser} = await import('../../../test/app/client/fixtures');
		const {findByRole} = render(
			<DataGridModelProvider>
				<DocumentsTable
					showDeleted
					loading={false}
					items={[]}
					page={0}
					pageSize={10}
				/>
			</DataGridModelProvider>,
		);

		const {user} = setupUser();

		const column = await findByRole('columnheader', {name: 'LastVersion'});

		// NOTE: No need to hover.
		// SEE: https://github.com/mui/mui-x/issues/4644.
		await user.click(await within(column).findByRole('button', {name: 'Menu'}));

		await user.click(await findByRole('menuitem', {name: 'Filter'}));

		await Promise.all([
			screen.findByRole('combobox', {name: 'Value'}),
			screen.findByRole('option', {name: 'any'}),
		]);
	});
});
