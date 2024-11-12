import {waitForElementToBeRemoved} from '@testing-library/dom';

import {
	client,
	historyBack,
	randomPassword,
	randomUserId,
} from '../../../../imports/_test/fixtures';

import {
	setupApp,
	createUserWithPasswordAndLogin,
	createNewPatient,
	searchForPatient,
	navigateTo,
	editConsultation,
	fillIn,
} from '../fixtures';

const scheduleAppointmentForPatient = async (
	app,
	{patientId, firstname, lastname},
) => {
	await searchForPatient(app, `${firstname} ${lastname}`, {
		name: `${firstname} ${lastname}`,
		id: patientId,
	});

	const {user, findByRole, findByLabelText, queryByRole, findAllByRole} = app;
	await user.click(await findByRole('button', {name: /^more actions/i}));

	await navigateTo(
		app,
		'Programmer un nouveau rendez-vous',
		`/new/appointment/for/${patientId}/week/current`,
		'button',
	);

	const buttons = await findAllByRole('button', {
		name: /^Schedule an appointment/,
	});
	console.debug({buttons: buttons.length});
	await user.click(buttons[0]);
	const time = '01:05 pm';
	console.debug(`Set time to ${time}`);
	await fillIn(app, await findByRole('textbox', {name: 'Time'}), time);
	console.debug('Set duration to 30m');
	// await user.click(await findByRole('button', {name: '15m'}));
	// NOTE: using workaround found at
	// SEE: https://github.com/testing-library/react-testing-library/issues/1248#issuecomment-1838053869
	await user.click(
		await findByLabelText('15m', {selector: '[role="combobox"]'}),
	);
	await user.click(await findByRole('option', {name: '30m'}, {timeout: 5000}));
	console.debug('Click on Schedule');
	await user.click(await findByRole('button', {name: 'Schedule'}));
	console.debug('Check heading');
	await findByRole('heading', {name: /^\/consultation\//}, {timeout: 10_000});
	console.debug('Check button');
	await findByRole('button', {name: 'Cancel'});
	await historyBack();
	const toggle = queryByRole('button', {name: 'Show no-shows'});
	if (toggle !== null) await user.click(toggle);
	await findByRole('link', {
		name: `13:05-13:35 ${lastname} ${firstname}`,
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
	}).timeout(35_000);

	it('should allow to cancel an appointment for a patient', async () => {
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

		await searchForPatient(app, `${lastname} ${firstname}`, {
			name: `${firstname} ${lastname}`,
			id: patientId,
		});

		await navigateTo(app, 'appointments', `/patient/${patientId}/appointments`);

		const {
			user,
			userWithoutPointerEventsCheck,
			findByRole,
			findByText,
			getByRole,
			queryByRole,
		} = app;
		console.debug('Click on 1:05 PM');
		await userWithoutPointerEventsCheck.click(
			await findByRole('link', {name: '1:05 PM'}),
		);
		console.debug("Confirm we are on the consultation's details page");
		await findByRole('heading', {name: /^\/consultation\//});

		console.debug('Click on Cancel');
		await user.click(await findByRole('button', {name: 'Cancel'}));
		console.debug(
			"Confirm we have opened the consultation's cancellation modal",
		);
		await findByRole('heading', {name: 'Cancel this appointment'}, {timeout: 10000});

		console.debug('Set cancellation reason');
		console.debug('Open cancellation reason choice menu');
		// await user.click(
		// await findByRole(
		// 'combobox',
		// {name: 'Please choose a reason for the cancellation (required)'},
		// {timeout: 5000},
		// ),
		// );
		// NOTE: using workaround found at
		// SEE: https://github.com/testing-library/react-testing-library/issues/1248#issuecomment-1838053869
		await user.click(
			await findByText(
				'Please choose a reason for the cancellation (required)',
				{selector: '[role="combobox"]'},
				{timeout: 5000},
			),
		);
		console.debug('Choose cancellation reason');
		await user.click(
			await findByRole('option', {name: 'patient-cancelled'}, {timeout: 10000}),
		);
		console.debug('Set cancellation explanation');
		await user.type(
			await findByRole('textbox', {name: 'Explanation for cancellation'}),
			'test',
		);
		console.debug('Click on cancellation button');
		await user.click(await findByRole('button', {name: 'Cancel Appointment'}));
		await findByRole('button', {name: 'Uncancel'}, {timeout: 5000});
		await navigateTo(app, 'Agenda', '/calendar/week/current');
		await user.click(
			await findByRole('button', {name: 'Show cancelled events'}),
		);
		await findByRole('link', {
			name: `13:05-13:35 ${lastname} ${firstname}`,
		});
		await user.click(
			await findByRole('button', {name: 'Hide cancelled events'}),
		);

		const linkToBeRemoved = queryByRole('link', {
			name: `13:05-13:35 ${lastname} ${firstname}`,
		});

		if (linkToBeRemoved !== null) {
			await waitForElementToBeRemoved(
				() =>
					getByRole('link', {
						name: `13:05-13:35 ${lastname} ${firstname}`,
					}),
				{timeout: 5000},
			);
		}
	}).timeout(40_000);

	it('should allow to begin a consultation for a patient', async () => {
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

		await searchForPatient(app, `${lastname} ${firstname}`, {
			name: `${firstname} ${lastname}`,
			id: patientId,
		});

		await navigateTo(app, 'appointments', `/patient/${patientId}/appointments`);

		const {user, userWithoutPointerEventsCheck, findByRole, findByText} = app;
		console.debug('Click on 1:05 PM');
		await userWithoutPointerEventsCheck.click(
			await findByRole('link', {name: '1:05 PM'}),
		);
		console.debug("Confirm we are on the consultation's details page");
		await findByRole('heading', {name: /^\/consultation\//});

		console.debug('Click on "Begin consultation"');
		await user.click(await findByRole('button', {name: 'Begin consultation'}));
		console.debug("Confirm we are on the consultation's edition page");
		await findByRole('heading', {name: /^\/edit\/consultation\//}, {timeout: 10000});

		await editConsultation(app, {
			reason: 'my test reason',
			done: 'my test done',
			todo: 'my test todo',
			treatment: 'my test treatment',
			next: 'my test next',
			more: 'my test more',
			price: '55',
			book: 'test-book-id',
			save: true,
		});

		await navigateTo(app, 'Dernière', '/consultation/last');

		await user.click(
			await findByRole('link', {
				name: `${lastname} ${firstname}`,
			}),
		);

		await navigateTo(app, 'appointments', `/patient/${patientId}/appointments`);

		await findByRole('heading', {name: 'Nothing to see on page 1.'});

		await navigateTo(
			app,
			'consultations',
			`/patient/${patientId}/consultations`,
		);

		await findByText('my test reason');
		await findByText('my test done');
		await findByText('my test todo');
		await findByText('my test treatment');
		await findByText('my test next');
		await findByText('my test more');
		await findByText('test-book-id');

		await findByText('À payé €55.00 de €55.00.');
	}).timeout(60_000);
});
