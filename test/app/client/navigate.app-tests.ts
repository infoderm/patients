import {
	client,
	randomPassword,
	randomUserId,
} from '../../../imports/test/fixtures';

import {navigationDrawerBlocks} from '../../../imports/ui/NavigationDrawer';

import {setupApp, createUserWithPasswordAndLogin} from './fixtures';

const navigateTo = async ({findByRole, user}, title: string, url: string) => {
	await user.click(await findByRole('button', {name: title}));
	await findByRole('heading', {name: url});
};

const testNavigation = (title: string, url: string) => {
	it(`should allow to reach ${url}`, async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(app, username, password);

		await navigateTo(app, title, url);
	});
};

client(__filename, () => {
	for (const {links} of navigationDrawerBlocks) {
		for (const {disabled, title, to} of links) {
			if (!disabled) testNavigation(title, to);
		}
	}
});
