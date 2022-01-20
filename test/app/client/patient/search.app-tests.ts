import {
	client,
	randomPassword,
	randomUserId,
} from '../../../../imports/test/fixtures';

import {
	setupApp,
	fillIn,
	createUserWithPasswordAndLogin,
	createNewPatient,
} from '../fixtures';

client(__filename, () => {
	it('should allow to search for a patient', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(app, username, password);

		const patientId = await createNewPatient(app, {
			firstname: 'John',
			lastname: 'Doe',
		});

		const {findByRole, getByPlaceholderText, user} = app;

		await fillIn(app, getByPlaceholderText(/^Search a patient/), 'John Doe');

		await findByRole('heading', {name: /^Results for query/});

		await user.click(await findByRole('link', {name: /john doe/i}));

		await findByRole('heading', {name: `/patient/${patientId}`});
	}).timeout(3000);
});
