import {
	client,
	randomPassword,
	randomUserId,
} from '../../../../imports/_test/fixtures';
import {randomPNGArrayBuffer} from '../../../../imports/_test/png';

import {
	setupApp,
	createUserWithPasswordAndLogin,
	navigateTo,
	createNewPatient,
	uploadFile,
} from '../fixtures';

client(__filename, () => {
	it('should allow to attach a file to a patient', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(app, username, password);

		const patientId = await createNewPatient(app, {
			firstname: 'John',
			lastname: 'Doe',
		});

		await navigateTo(app, 'attachments', `/patient/${patientId}/attachments`);

		const {findByRole, findByLabelText} = app;

		await findByRole('heading', {name: 'Nothing to see on page 1.'});

		const buffer = await randomPNGArrayBuffer();
		const file = new File([buffer], 'hello.png', {type: 'image/png'});

		const button = await findByLabelText('Attach File');
		uploadFile(button, file);

		await findByRole('heading', {name: 'Pièces jointes au patient'});
	});
});
