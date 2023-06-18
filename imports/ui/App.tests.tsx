// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import React from 'react';
import {render, waitForElementToBeRemoved} from '@testing-library/react';

import {client, randomPassword, randomUserId} from '../_test/fixtures';
import App from './App';

const setup = async (jsx: JSX.Element) => {
	const {default: userEvent} = await import('@testing-library/user-event');
	return {
		user: userEvent.setup(),
		...render(jsx),
	};
};

const renderApp = () => render(<App />);
const setupApp = async () => setup(<App />);

client(__filename, () => {
	it('should render', () => {
		const {getByRole} = renderApp();
		getByRole('heading', {name: 'Loading...'});
	});

	it('should load', async () => {
		const {getByRole, findByRole} = renderApp();
		await waitForElementToBeRemoved(() => {
			return getByRole('heading', {name: 'Loading...'});
		});
		await findByRole('heading', {name: 'Please sign in'});
	});

	it('should allow to register a new user', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const {getByRole, findByRole, getByLabelText, user} = await setupApp();
		await user.click(await findByRole('button', {name: 'Sign in'}));
		await user.click(await findByRole('button', {name: 'Create account?'}));
		await findByRole('button', {name: 'Register'});
		await user.type(getByLabelText('Username'), username);
		await user.type(getByLabelText('Password'), password);
		await user.click(getByRole('button', {name: 'Register'}));
		await waitForElementToBeRemoved(
			() => {
				return getByRole('button', {name: 'Register'});
			},
			{timeout: 5000},
		);
		await user.click(
			await findByRole('button', {name: `Logged in as ${username}`}),
		);
	});
});
