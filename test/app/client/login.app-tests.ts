import {
	client,
	randomPassword,
	randomUserId,
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
});
