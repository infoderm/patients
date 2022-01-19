import {within, waitForElementToBeRemoved} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

export const setupApp = () => {
	return {
		user: userEvent.setup(),
		...within(document.body),
	};
};

/**
 * @deprecated
 */
const flakyCloseModals = async ({user}) => {
	// This is to escape any modals that have been opened by previous tests.
	// TODO find way to do this in cleanup hook
	await user.keyboard('[Escape]');
	await user.keyboard('[Escape]');
	await user.keyboard('[Escape]');
};

export const createUserWithPasswordAndLogin = async (
	{getByRole, findByRole, getByLabelText, user},
	username: string,
	password: string,
) => {
	await flakyCloseModals({user});
	console.debug('Waiting for Sign in button');
	await user.click(await findByRole('button', {name: 'Sign in'}));
	console.debug('Waiting for Create account button');
	await user.click(await findByRole('button', {name: 'Create account?'}));
	console.debug('Waiting for Register button');
	await findByRole('button', {name: 'Register'});
	console.debug('Filling in username');
	await user.clear(getByLabelText('Username'));
	await user.type(getByLabelText('Username'), username);
	console.debug('Filling in password');
	await user.clear(getByLabelText('Password'));
	await user.type(getByLabelText('Password'), password);
	console.debug('Clicking the register button');
	await user.click(getByRole('button', {name: 'Register'}));
	console.debug('Waiting for the register button to be removed');
	await waitForElementToBeRemoved(() => {
		return getByRole('button', {name: 'Register'});
	});
	console.debug('Waiting for "Logged in as ..." button to appear');
	await findByRole('button', {name: `Logged in as ${username}`});
	console.debug('User successfully created and logged in');
};

export const logout = async ({getByRole, findByRole, user}) => {
	await flakyCloseModals({user});
	console.debug('Waiting for button "Logged in as ..."');
	await user.click(await findByRole('button', {name: /^Logged in as /}));
	console.debug('Waiting for Logout menuitem');
	await user.click(await findByRole('menuitem', {name: 'Logout'}));
	console.debug('Waiting for Logout menuitem to be removed');
	await waitForElementToBeRemoved(() => {
		return getByRole('menuitem', {name: 'Logout'});
	});
	console.debug('Waiting for Sign in button to appear');
	await findByRole('button', {name: 'Sign in'});
	console.debug('User succesfully logged out');
};

export const loginWithPassword = async (
	{getByRole, findByRole, getByLabelText, user},
	username: string,
	password: string,
) => {
	await flakyCloseModals({user});
	console.debug('Waiting for Sign in button');
	await user.click(await findByRole('button', {name: 'Sign in'}));
	console.debug('Waiting for Log in button');
	await findByRole('button', {name: 'Log in'});
	console.debug('Filling in username');
	await user.clear(getByLabelText('Username'));
	await user.type(getByLabelText('Username'), username);
	console.debug('Filling in password');
	await user.clear(getByLabelText('Password'));
	await user.type(getByLabelText('Password'), password);
	console.debug('Clicking the "Log in" button');
	await user.click(getByRole('button', {name: 'Log in'}));
	console.debug('Waiting for the "Log in" button to be removed');
	await waitForElementToBeRemoved(() => {
		return getByRole('button', {name: 'Log in'});
	});
	console.debug('Waiting for "Logged in as ..." button to appear');
	await findByRole('button', {name: `Logged in as ${username}`});
	console.debug('User succesfully logged in');
};

export const createUserWithPassword = async (
	app,
	username: string,
	password: string,
) => {
	await createUserWithPasswordAndLogin(app, username, password);
	await logout(app);
};

export const navigateTo = async (
	{findByRole, user},
	title: string,
	url: string,
) => {
	await user.click(await findByRole('button', {name: title}));
	await findByRole('heading', {name: url});
};
