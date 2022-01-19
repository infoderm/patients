import {
	client,
	randomPassword,
	randomUserId,
	throws,
} from '../../../imports/test/fixtures';

import {setupApp, createUserWithPassword, loginWithPassword} from './fixtures';

client(__filename, () => {
	it('should allow to log in', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPassword(app, username, password);
		await loginWithPassword(app, username, password);
	});

	it('should not allow to log in with non-existing user', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await throws(
			async () => loginWithPassword(app, username, password),
			/Timed out/,
		);
		await app.findByText('User not found');
	}).timeout(5000);

	it('should not allow to log in with wrong password', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPassword(app, username, password);
		await throws(
			async () => loginWithPassword(app, username, `${password}-typo`),
			/Timed out/,
		);
		await app.findByText('Incorrect password');
	}).timeout(5000);

	it('should not allow to log in with wrong username', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPassword(app, username, password);
		await throws(
			async () => loginWithPassword(app, `${username}-typo`, password),
			/Timed out/,
		);
		await app.findByText('User not found');
	}).timeout(5000);

	it("should not allow to log in with other user's passowrd", async () => {
		const username1 = randomUserId();
		const password1 = randomPassword();
		const username2 = randomUserId();
		const password2 = `${password1}-typo`;
		const app = setupApp();
		await createUserWithPassword(app, username1, password1);
		await createUserWithPassword(app, username2, password2);
		await throws(
			async () => loginWithPassword(app, username1, password2),
			/Timed out/,
		);
		await app.findByText('Incorrect password');

		await throws(
			async () => loginWithPassword(app, username2, password1),
			/Timed out/,
		);
		await app.findByText('Incorrect password');
	}).timeout(10_000);
});
