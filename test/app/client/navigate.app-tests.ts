import {
	client,
	randomPassword,
	randomUserId,
} from '../../../imports/test/fixtures';

import {setupApp, createUserWithPasswordAndLogin} from './fixtures';

client(__filename, () => {
	it('should allow to reach /consultation/last', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(app, username, password);

		const {findByRole, user} = app;
		await user.click(await findByRole('button', {name: 'Dernière'}));

		await findByRole('heading', {name: '/consultation/last'});
	});

	it('should allow to reach /stats', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(app, username, password);

		const {findByRole, user} = app;
		await user.click(await findByRole('button', {name: 'Stats'}));

		await findByRole('heading', {name: '/stats'});
	});
});
