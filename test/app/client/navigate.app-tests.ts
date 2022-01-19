import {
	client,
	randomPassword,
	randomUserId,
} from '../../../imports/test/fixtures';

import {setupApp, createUserWithPasswordAndLogin} from './fixtures';

const navigateTo = async ({findByRole, user}, title, url) => {
	await user.click(await findByRole('button', {name: title}));
	await findByRole('heading', {name: url});
};

client(__filename, () => {
	it('should allow to reach /consultation/last', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(app, username, password);

		await navigateTo(app, 'Dernière', '/consultation/last');
	});

	it('should allow to reach /stats', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(app, username, password);

		await navigateTo(app, 'Stats', '/stats');
	});
});
