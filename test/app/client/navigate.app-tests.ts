import {
	client,
	randomPassword,
	randomUserId,
} from '../../../imports/_test/fixtures';
import createUserWithPasswordAndLogin from '../../../imports/api/user/createUserWithPasswordAndLogin';

import {navigationDrawerBlocks} from '../../../imports/ui/NavigationDrawer';

import {setupApp, navigateTo} from './fixtures';

const testNavigation = (title: string, url: string) => {
	it(`should allow to reach ${url}`, async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(username, password);

		await navigateTo(app, title, url);
	});
};

client(__filename, () => {
	for (const {links} of navigationDrawerBlocks) {
		for (const {disabled, title, to} of links) {
			if (!disabled) testNavigation(title, to);
		}
	}

	it('should allow to reach /calendar/month/* from Agenda', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(username, password);

		await navigateTo(app, 'Agenda', '/calendar/week/current');
		await navigateTo(app, 'Month', /^\/calendar\/month\//);
	});

	it('should allow to reach /settings/* tabs', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(username, password);

		await navigateTo(app, 'Settings', '/settings');
		await navigateTo(app, 'ui', '/settings/ui');
		await navigateTo(app, 'theme', '/settings/theme');
		await navigateTo(app, 'payment', '/settings/payment');
		await navigateTo(app, 'locale', '/settings/locale');
		await navigateTo(app, 'agenda', '/settings/agenda');
		await navigateTo(app, 'text', '/settings/text');
	});
});
