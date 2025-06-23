import {faker} from '@faker-js/faker';

import {
	client,
	randomPassword,
	randomUserId,
} from '../../../../imports/_test/fixtures';
import createUserWithPasswordAndLogin from '../../../../imports/api/user/createUserWithPasswordAndLogin';

import {newUpload} from '../../../../imports/api/_dev/populate/uploads';

import {setupApp, navigateTo} from '../fixtures';

const textNoIssues = 'All uploads are attached to something :)';

client(__filename, () => {
	it('should allow to delete an upload', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(username, password);

		const attachmentName = faker.string.uuid();

		await newUpload(undefined, {name: attachmentName});

		await navigateTo(app, 'Issues', '/issues');

		await navigateTo(
			app,
			'uploads-not-attached',
			'/issues/uploads-not-attached',
		);

		const {user, findByRole, findByText} = app;

		await findByRole('img', {name: attachmentName});

		await user.click(
			await findByRole('button', {name: `open menu for ${attachmentName}`}),
		);

		await user.click(await findByRole('menuitem', {name: 'Delete forever'}));

		await user.click(await findByRole('button', {name: 'autofill'}));

		await user.click(await findByRole('button', {name: 'Delete forever'}));

		await findByText(textNoIssues);
	});
});
