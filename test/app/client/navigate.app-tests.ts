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

	it('should allow to reach /issues/* tabs', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(username, password);

		await navigateTo(app, 'Issues', '/issues');
		await navigateTo(
			app,
			'uploads-not-attached',
			'/issues/uploads-not-attached',
		);
		await navigateTo(
			app,
			'documents-not-decoded',
			'/issues/documents-not-decoded',
		);
		await navigateTo(
			app,
			'documents-not-parsed',
			'/issues/documents-not-parsed',
		);
		await navigateTo(
			app,
			'documents-not-linked',
			'/issues/documents-not-linked',
		);
		await navigateTo(
			app,
			'consultations-no-payment',
			'/issues/consultations-no-payment',
		);
		await navigateTo(
			app,
			'consultations-no-book',
			'/issues/consultations-no-book',
		);
		await navigateTo(
			app,
			'consultations-price-is-zero',
			'/issues/consultations-price-is-zero',
		);
		await navigateTo(
			app,
			'doctors-non-alphabetical',
			'/issues/doctors-non-alphabetical',
		);
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
