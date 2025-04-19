import {
	client,
	randomPassword,
	randomUserId,
} from '../../../../imports/_test/fixtures';

import {exampleMedidocReport} from '../../../../imports/api/_dev/populate/documents';

import createUserWithPasswordAndLogin from '../../../../imports/api/user/createUserWithPasswordAndLogin';

import {setupApp, navigateTo, uploadFile} from '../fixtures';

client(__filename, () => {
	it('should allow to delete documents', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(username, password);

		const {findByRole, findByText, findByLabelText, user} = app;

		await navigateTo(app, 'Documents', '/documents');

		await findByText('No rows');

		uploadFile(
			await findByLabelText('Import Document'),
			new File([exampleMedidocReport.contents], 'test.txt'),
		);

		await findByText('PZ7654321Y9');

		await user.click(await findByRole('menuitem', {name: 'more'}));

		await user.click(
			await findByRole('menuitem', {name: /^Delete document #/}),
		);

		await user.click(await findByRole('button', {name: 'Delete'}));

		await findByText('No rows');

		await user.click(
			await findByRole('button', {name: 'Show deleted documents'}),
		);

		await findByText('PZ7654321Y9');

		await user.click(
			await findByRole('button', {name: 'Hide deleted documents'}),
		);

		await findByText('No rows');
	});
});
