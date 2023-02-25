import {
	client,
	randomPassword,
	randomUserId,
} from '../../../imports/_test/fixtures';

import {setupApp, createUserWithPasswordAndLogin} from './fixtures';

client(__filename, () => {
	it('should allow to register a new user', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(app, username, password);
	});
});
