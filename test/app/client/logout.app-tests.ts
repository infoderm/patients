import {
	client,
	randomPassword,
	randomUserId,
} from '../../../imports/_test/fixtures';
import createUserWithPasswordAndLogin from '../../../imports/api/user/createUserWithPasswordAndLogin';

import {setupApp, logout} from './fixtures';

client(__filename, () => {
	it('should allow to log out', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(username, password);
		await logout(app);
	});
});
