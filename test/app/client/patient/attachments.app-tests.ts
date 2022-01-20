import {fireEvent} from '@testing-library/dom';
import {
	client,
	randomPassword,
	randomUserId,
} from '../../../../imports/test/fixtures';
import {randomPNGArrayBuffer} from '../../../../imports/test/png';

import {
	setupApp,
	createUserWithPasswordAndLogin,
	navigateTo,
	createNewPatient,
} from '../fixtures';

const uploadFile = (button, file) => {
	const input = button.parentElement.querySelector('input[type="file"]');
	// await user.upload(input, file) does not work:
	// Error: Unable to perform pointer interaction as the element has or
	// inherits pointer-events set to "none".
	// Also could not find good way to query "input" other than through its
	// proxy button.
	fireEvent.change(input, {
		target: {files: [file]},
	});
};

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
	}).timeout(3000);
});
