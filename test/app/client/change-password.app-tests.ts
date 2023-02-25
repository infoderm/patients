import {
	client,
	randomPassword,
	randomUserId,
	throws,
} from '../../../imports/_test/fixtures';

import {
	setupApp,
	createUserWithPasswordAndLogin,
	changePassword,
	logout,
	loginWithPassword,
} from './fixtures';

client(__filename, () => {
	it('should allow to change password', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(app, username, password);

		const newPassword = `${password}-changed`;
		await changePassword(app, password, newPassword);
	});

	it('should not allow to change password with wrong password', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(app, username, password);
		await throws(
			async () => changePassword(app, `${password}-typo`, password),
			/Timed out/,
		);
		await app.findByText('Incorrect password');
	});

	it('should not allow to change password with empty password', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(app, username, password);
		await throws(async () => changePassword(app, password, ''), /Timed out/);
		await app.findByText('Password may not be empty');
	});

	it('should allow to login with new password after password change', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(app, username, password);

		const newPassword = `${password}-changed`;
		await changePassword(app, password, newPassword);
		await logout(app);
		await loginWithPassword(app, username, newPassword);
	});

	it('should not allow to login with old password after password change', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(app, username, password);

		const newPassword = `${password}-changed`;
		await changePassword(app, password, newPassword);
		await logout(app);

		await throws(
			async () => loginWithPassword(app, username, password),
			/Timed out/,
		);
		await app.findByText('Incorrect password');
	}).timeout(10_000);
});
