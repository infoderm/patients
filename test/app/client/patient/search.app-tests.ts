import {
	client,
	randomPassword,
	randomUserId,
} from '../../../../imports/_test/fixtures';
import createUserWithPasswordAndLogin from '../../../../imports/api/user/createUserWithPasswordAndLogin';

import {setupApp, createNewPatient, searchForPatient} from '../fixtures';

client(__filename, () => {
	it.only('should allow to search for a patient', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(username, password);

		const patientId = await createNewPatient(app, {
			firstname: 'John',
			lastname: 'Doe',
		});

		await searchForPatient(app, 'John Doe', {name: 'John Doe', id: patientId});
	});
});
