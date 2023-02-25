import {
	client,
	randomPassword,
	randomUserId,
} from '../../../imports/_test/fixtures';

import {setupApp, createUserWithPasswordAndLogin, logout} from './fixtures';

client(__filename, () => {
	it('should allow to log out', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(app, username, password);
		await logout(app);
	});
});
