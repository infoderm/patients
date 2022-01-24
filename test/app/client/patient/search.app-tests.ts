import {
	client,
	randomPassword,
	randomUserId,
} from '../../../../imports/test/fixtures';

import {
	setupApp,
	createUserWithPasswordAndLogin,
	createNewPatient,
	searchForPatient,
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

		await searchForPatient(app, 'John Doe', {name: 'John Doe', id: patientId});
	});
});
