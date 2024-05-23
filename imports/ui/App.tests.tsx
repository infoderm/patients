import React from 'react';

import {type BoundFunctions, type queries} from '@testing-library/dom';

import {render, waitForElementToBeRemoved} from '../_test/react';

import {client, randomPassword, randomUserId} from '../_test/fixtures';

import App from './App';

const setup = async (jsx: JSX.Element) => {
	const {default: userEvent} = await import('@testing-library/user-event');
	return {
		user: userEvent.setup(),
		...(render(jsx) as BoundFunctions<typeof queries>),
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
		const {createUserWithPasswordAndLogin} = await import(
			'../../test/app/client/fixtures'
		);
		const username = randomUserId();
		const password = randomPassword();
		const app = await setupApp();
		const button = await createUserWithPasswordAndLogin(
			app,
			username,
			password,
		);
		await app.user.click(button);
	}).timeout(10_000);
});
