import {faker} from '@faker-js/faker';

import {
	client,
	randomPassword,
	randomUserId,
} from '../../../../imports/_test/fixtures';
import {randomPNGArrayBuffer} from '../../../../imports/_test/png';
import createUserWithPasswordAndLogin from '../../../../imports/api/user/createUserWithPasswordAndLogin';

import {newUpload} from '../../../../imports/api/_dev/populate/uploads';

import call from '../../../../imports/api/endpoint/call';
import attachToPatient from '../../../../imports/api/endpoint/patients/attach';

import {setupApp, navigateTo, createNewPatient, uploadFile} from '../fixtures';

client(__filename, () => {
	it.only('should allow to attach a file to a patient', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(username, password);

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

		await findByRole('heading', {name: 'Pièces jointes au patient'}, {timeout: 10_000});
	});

	it('should allow to detach a file from a patient', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(username, password);

		const attachmentName = faker.string.uuid();

		const patientId = await createNewPatient(app, {
			firstname: 'John',
			lastname: 'Doe',
		});

		const {_id: uploadId} = await newUpload(undefined, {name: attachmentName});
		await call(attachToPatient, patientId!, uploadId);

		await navigateTo(app, 'attachments', `/patient/${patientId}/attachments`);

		const {user, findByRole} = app;

		await findByRole('heading', {name: 'Pièces jointes au patient'});

		await findByRole('img', {name: attachmentName});

		await user.click(
			await findByRole('button', {name: `open menu for ${attachmentName}`}),
		);

		await user.click(await findByRole('menuitem', {name: 'Detach'}));

		await user.click(await findByRole('button', {name: 'autofill'}));

		await user.click(await findByRole('button', {name: 'Detach'}));

		await findByRole('heading', {name: 'Nothing to see on page 1.'});
	});
});
