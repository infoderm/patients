import {within, waitForElementToBeRemoved} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

export const setupApp = () => {
	return {
		user: userEvent.setup(),
		...within(document.body),
	};
};

const fillIn = async ({user}, element, value: string) => {
	await user.clear(element);
	if (value !== '') {
		await user.type(element, value);
	}
	// NOTE
	// Could also use user.type(element, value, {initialSelectionStart: 0, initialSelectionEnd: -1})
	// or equivalent instead but not sure it models how most users would reset
	// pre-filled input
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
	await fillIn({user}, getByLabelText('Username'), username);
	console.debug('Filling in password');
	await fillIn({user}, getByLabelText('Password'), password);
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
	await fillIn({user}, getByLabelText('Username'), username);
	console.debug('Filling in password');
	await fillIn({user}, getByLabelText('Password'), password);
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

export const changePassword = async (
	{getByRole, findByRole, getByLabelText, findByText, user},
	oldPassword: string,
	newPassword: string,
) => {
	await flakyCloseModals({user});
	console.debug('Waiting for button "Logged in as ..."');
	await user.click(await findByRole('button', {name: /^Logged in as /}));
	console.debug('Waiting for Change password menuitem');
	await user.click(await findByRole('menuitem', {name: 'Change password'}));

	console.debug('Waiting for Change password button');
	await user.click(await findByRole('button', {name: 'Change password'}));

	console.debug('Filling in old password');
	await fillIn({user}, getByLabelText('Old password'), oldPassword);
	console.debug('Filling in new password');
	await fillIn({user}, getByLabelText('New password'), newPassword);

	console.debug('Clicking the "Change password" button');
	await user.click(await findByRole('button', {name: 'Change password'}));

	console.debug('Waiting for the "Change password" button to be removed');
	await waitForElementToBeRemoved(() => {
		return getByRole('button', {name: 'Change password'});
	});
	console.debug('Waiting for confirmation snackbar to appear');
	await findByText('Password changed successfully!');
	console.debug('Password changed successfully');
};

export const navigateTo = async (
	{findByRole, user},
	title: string,
	url: string | RegExp,
) => {
	await user.click(await findByRole('button', {name: title}));
	await findByRole('heading', {name: url});
};
