import {
	within,
	fireEvent,
	waitForElementToBeRemoved,
} from '@testing-library/dom';
import userEvent, {PointerEventsCheckLevel} from '@testing-library/user-event';

export const setupApp = () => {
	const user = userEvent.setup();
	return {
		user,
		userWithoutPointerEventsCheck: user.setup({
			pointerEventsCheck: PointerEventsCheckLevel.Never,
		}),
		userWithRealisticTypingSpeed: user.setup({
			delay: 100,
		}),
		...within(document.body),
	};
};

export const fillIn = async ({user}, element: HTMLElement, value: string) => {
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
	{findByRole, userWithoutPointerEventsCheck},
	title: string,
	url: string | RegExp,
) => {
	await userWithoutPointerEventsCheck.click(
		await findByRole('link', {name: title}),
	);
	await findByRole('heading', {name: url});
};

export const createNewPatient = async (app, {firstname, lastname}) => {
	await navigateTo(app, 'Nouveau', '/new/patient');

	const {findByRole, getByLabelText, getByRole, user} = app;

	await findByRole('button', {name: 'Create new patient'});
	await user.type(getByLabelText('Last name'), lastname);
	await user.type(getByLabelText('First name'), firstname);
	await user.click(getByRole('button', {name: 'Create new patient'}));

	await findByRole('heading', {name: /^\/patient\//});

	return window.location.href.split('/').pop();
};

export const searchResultsForQuery = async (app, query) => {
	const {userWithoutPointerEventsCheck, findByRole, getByRole} = app;
	await userWithoutPointerEventsCheck.type(
		getByRole('searchbox', {name: 'Patient search'}),
		query,
	);
	await findByRole('heading', {name: /^Results for query/});
};

export const searchForPatient = async (app, query, {name, id}) => {
	const {findByRole, user} = app;
	await searchResultsForQuery(app, query);
	await user.click(await findByRole('link', {name}));
	await findByRole('heading', {name: `/patient/${id}`});
};

interface EditConsultationOptions {
	reason?: string;
	done?: string;
	todo?: string;
	treatment?: string;
	next?: string;
	more?: string;
	price?: string;
	paid?: string;
	book?: string;
	inBookNumber?: string;
	save?: boolean;
}

export const editConsultation = async (
	app,
	{
		reason,
		done,
		todo,
		treatment,
		next,
		more,
		price,
		paid,
		book,
		inBookNumber,
		save,
	}: EditConsultationOptions,
) => {
	const {user, findByRole} = app;
	console.debug('Fill in text fields');
	if (reason !== undefined) {
		await fillIn(
			app,
			await findByRole('textbox', {name: 'Motif de la visite'}),
			reason,
		);
	}

	if (done !== undefined) {
		await fillIn(
			app,
			await findByRole('textbox', {name: 'Examens déjà réalisés'}),
			done,
		);
	}

	if (todo !== undefined) {
		await fillIn(
			app,
			await findByRole('textbox', {name: 'Examens à réaliser'}),
			todo,
		);
	}

	if (treatment !== undefined) {
		await fillIn(
			app,
			await findByRole('textbox', {name: 'Traitement'}),
			treatment,
		);
	}

	if (next !== undefined) {
		await fillIn(app, await findByRole('textbox', {name: 'À revoir'}), next);
	}

	if (more !== undefined) {
		await fillIn(
			app,
			await findByRole('textbox', {name: 'Autres remarques'}),
			more,
		);
	}

	if (price !== undefined) {
		await fillIn(app, await findByRole('textbox', {name: 'Prix'}), price);
	}

	if (paid !== undefined) {
		await fillIn(app, await findByRole('textbox', {name: 'Payé'}), paid);
	}

	if (book !== undefined) {
		await fillIn(app, await findByRole('combobox', {name: 'Carnet'}), book);
	}

	if (inBookNumber !== undefined) {
		await fillIn(app, await findByRole('textbox', {name: 'N°'}), inBookNumber);
	}

	if (save) await user.click(await findByRole('button', {name: 'save'}));
};

export const uploadFile = (button, file) => {
	const input = button.closest('label').querySelector('input[type="file"]');
	// await user.upload(input, file) does not work:
	// Error: Unable to perform pointer interaction as the element has or
	// inherits pointer-events set to "none".
	// Also could not find good way to query "input" other than through its
	// proxy button.
	fireEvent.change(input, {
		target: {files: [file]},
	});
};
