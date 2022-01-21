import {
	client,
	historyBack,
	randomPassword,
	randomUserId,
} from '../../../../imports/test/fixtures';

import {
	setupApp,
	createUserWithPasswordAndLogin,
	createNewPatient,
	searchForPatient,
} from '../fixtures';

const selectMobileClockButton = async ({user}, button) => {
	while (!Array.from(button.classList).includes('Mui-focusVisible')) {
		console.debug(button.classList);
		// eslint-disable-next-line no-await-in-loop
		await user.keyboard('[Tab]');
	}

	await user.keyboard('[Enter]');
};

const scheduleAppointmentForPatient = async (
	app,
	{patientId, firstname, lastname},
) => {
	await searchForPatient(app, `${firstname} ${lastname}`, {
		name: `${firstname} ${lastname}`,
		id: patientId,
	});

	const {user, findByRole, findAllByRole} = app;
	await user.click(await findByRole('button', {name: /^more actions/i}));

	await user.click(
		await findByRole('button', {name: 'Programmer un nouveau rendez-vous'}),
	);

	await findByRole('heading', {name: `/new/appointment/for/${patientId}`});
	const buttons = await findAllByRole('button', {
		name: /^Schedule an appointment/,
	});
	console.debug({buttons: buttons.length});
	await user.click(buttons[0]);
	console.debug('Click on choose time');
	await user.click(await findByRole('textbox', {name: /^Choose time/}));
	console.debug('Select 1');
	await selectMobileClockButton(
		app,
		await findByRole('button', {name: '1 hours'}),
	);
	console.debug('Select 05');
	await selectMobileClockButton(
		app,
		await findByRole('button', {name: '05 minutes'}),
	);
	console.debug('Click on PM');
	await user.click(await findByRole('button', {name: 'PM'}));
	console.debug('Click on OK');
	await user.click(await findByRole('button', {name: 'OK'}));
	console.debug('Set duration to 30m');
	await user.click(await findByRole('button', {name: '15m'}));
	await user.click(await findByRole('option', {name: '30m'}));
	console.debug('Click on Schedule');
	await user.click(await findByRole('button', {name: 'Schedule'}));
	console.debug('Check heading');
	await findByRole('heading', {name: /^\/consultation\//});
	console.debug('Check button');
	await findByRole('button', {name: 'Cancel'});
	await historyBack();
	await user.click(await findByRole('button', {name: 'Show no-shows'}));
	await findByRole('link', {
		name: `13:05-13:35 ${lastname} ${firstname}`,
		exact: false,
	});
};

client(__filename, () => {
	it('should allow to schedule an appointment for a patient', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(app, username, password);

		const firstname = 'John';
		const lastname = 'Doe';

		const patientId = await createNewPatient(app, {
			firstname,
			lastname,
		});

		await scheduleAppointmentForPatient(app, {patientId, firstname, lastname});
	}).timeout(10_000);
});
