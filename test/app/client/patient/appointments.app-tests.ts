import {waitForElementToBeRemoved} from '@testing-library/dom';
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

	const {user, findByRole, findAllByRole} = app;
	await user.click(await findByRole('button', {name: /^more actions/i}));

	await user.click(
		await findByRole('button', {name: 'Programmer un nouveau rendez-vous'}),
	);

	await findByRole('heading', {
		name: `/new/appointment/for/${patientId}/week/current`,
	});
	const buttons = await findAllByRole('button', {
		name: /^Schedule an appointment/,
	});
	console.debug({buttons: buttons.length});
	await user.click(buttons[0]);
	const time = '01:05 pm';
	console.debug(`Set time to ${time}`);
	await fillIn(app, await findByRole('textbox', {name: 'Time'}), time);
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
			queryByRole,
			getByRole,
			findByLabelText,
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
		await findByRole('heading', {name: 'Cancel this appointment'});

		console.debug('Set cancellation reason');
		await user.click(await findByLabelText('Cancellation reason'));
		await user.click(await findByRole('option', {name: 'patient-cancelled'}));
		console.debug('Set cancellation explanation');
		await user.type(
			await findByRole('textbox', {name: 'Explanation for cancellation'}),
			'test',
		);
		console.debug('Click on cancellation button');
		await user.click(await findByRole('button', {name: 'Cancel Appointment'}));
		await findByRole('button', {name: 'Uncancel'});
		await navigateTo(app, 'Agenda', '/calendar/week/current');
		await user.click(
			await findByRole('button', {name: 'Show cancelled events'}),
		);
		await findByRole('link', {
			name: `13:05-13:35 ${lastname} ${firstname}`,
			exact: false,
		});
		await user.click(
			await findByRole('button', {name: 'Hide cancelled events'}),
		);
		if (
			queryByRole('link', {
				name: `13:05-13:35 ${lastname} ${firstname}`,
				exact: false,
			}) !== null
		) {
			await waitForElementToBeRemoved(() => {
				return getByRole('link', {
					name: `13:05-13:35 ${lastname} ${firstname}`,
					exact: false,
				});
			});
		}
	}).timeout(15_000);

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
		await findByRole('heading', {name: /^\/edit\/consultation\//});

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
				exact: false,
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
	}).timeout(15_000);
});
