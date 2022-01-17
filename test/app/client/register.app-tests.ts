import {within, waitForElementToBeRemoved} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import {
	client,
	randomPassword,
	randomUserId,
} from '../../../imports/test/fixtures';

const setupApp = () => {
	return {
		user: userEvent.setup(),
		...within(document.body),
	};
};

client(__filename, () => {
	it('should allow to register a new user', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const {getByRole, findByRole, getByLabelText, user} = setupApp();
		await user.click(await findByRole('button', {name: 'Sign in'}));
		await user.click(await findByRole('button', {name: 'Create account?'}));
		await findByRole('button', {name: 'Register'});
		await user.type(getByLabelText('Username'), username);
		await user.type(getByLabelText('Password'), password);
		await user.click(getByRole('button', {name: 'Register'}));
		await waitForElementToBeRemoved(() => {
			return getByRole('button', {name: 'Register'});
		});
		await user.click(
			await findByRole('button', {name: `Logged in as ${username}`}),
		);
	});
});
