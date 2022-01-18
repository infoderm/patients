import {within, waitForElementToBeRemoved} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

export const setupApp = () => {
	return {
		user: userEvent.setup(),
		...within(document.body),
	};
};

export const createUserWithPasswordAndLogin = async (
	{getByRole, findByRole, getByLabelText, user},
	username: string,
	password: string,
) => {
	await user.click(await findByRole('button', {name: 'Sign in'}));
	await user.click(await findByRole('button', {name: 'Create account?'}));
	await findByRole('button', {name: 'Register'});
	await user.type(getByLabelText('Username'), username);
	await user.type(getByLabelText('Password'), password);
	await user.click(getByRole('button', {name: 'Register'}));
	await waitForElementToBeRemoved(() => {
		return getByRole('button', {name: 'Register'});
	});
	await findByRole('button', {name: `Logged in as ${username}`});
};

export const logout = async ({getByRole, findByRole, user}) => {
	await user.click(await findByRole('button', {name: /^Logged in as /}));
	await user.click(await findByRole('menuitem', {name: 'Logout'}));
	await waitForElementToBeRemoved(() => {
		return getByRole('menuitem', {name: 'Logout'});
	});
	await findByRole('button', {name: 'Sign in'});
};

export const loginWithPassword = async (
	{getByRole, findByRole, getByLabelText, user},
	username: string,
	password: string,
) => {
	await user.click(await findByRole('button', {name: 'Sign in'}));
	await findByRole('button', {name: 'Log in'});
	await user.type(getByLabelText('Username'), username);
	await user.type(getByLabelText('Password'), password);
	await user.click(getByRole('button', {name: 'Log in'}));
	await waitForElementToBeRemoved(() => {
		return getByRole('button', {name: 'Log in'});
	});
	await findByRole('button', {name: `Logged in as ${username}`});
};

export const createUserWithPassword = async (
	app,
	username: string,
	password: string,
) => {
	await createUserWithPasswordAndLogin(app, username, password);
	await logout(app);
};
