import {
	client,
	randomPassword,
	randomUserId,
} from '../../../../imports/_test/fixtures';
import createUserWithPasswordAndLogin from '../../../../imports/api/user/createUserWithPasswordAndLogin';

import {
	setupApp,
	createNewPatient,
	searchForPatient,
	navigateTo,
	editConsultation,
} from '../fixtures';

client(__filename, () => {
	it.only('should allow to edit a consultation for a patient', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(username, password);

		const firstname = 'John';
		const lastname = 'Doe';

		const patientId = await createNewPatient(app, {
			firstname,
			lastname,
		});

		await searchForPatient(app, `${lastname} ${firstname}`, {
			name: `${firstname} ${lastname}`,
			id: patientId,
		});

		const {user, findByRole, findByText} = app;

		await user.click(await findByRole('button', {name: /^more actions/i}));

		await user.click(
			await findByRole('button', {
				name: 'Créer une nouvelle consultation vierge',
			}),
		);

		console.debug("Confirm we are on the consultation's creation page");
		await findByRole('heading', {name: /^\/new\/consultation\/for\//});

		await editConsultation(app, {
			reason: 'my test reason',
			done: 'my test done',
			todo: 'my test todo',
			treatment: 'my test treatment',
			next: 'my test next',
			more: 'my test more',
			price: '45',
			paid: '0',
			book: 'test-book-id',
			save: true,
		});

		await navigateTo(app, 'Dernière', '/consultation/last');

		await findByText('my test reason');
		await findByText('my test done');
		await findByText('my test todo');
		await findByText('my test treatment');
		await findByText('my test next');
		await findByText('my test more');
		await findByText('test-book-id');

		await findByText('À payé €0.00 de €45.00.');

		await user.click(await findByRole('link', {name: 'Edit'}));

		await editConsultation(app, {
			reason: 'my test reason edited',
			paid: '45',
			save: true,
		});

		await navigateTo(app, 'Dernière', '/consultation/last');

		await findByText('my test reason edited');
		await findByText('my test done');
		await findByText('my test todo');
		await findByText('my test treatment');
		await findByText('my test next');
		await findByText('my test more');
		await findByText('test-book-id');

		await findByText('À payé €45.00 de €45.00.');
	}).timeout(45_000);
});
