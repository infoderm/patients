import assert from 'assert';
import dateFormat from 'date-fns/format';

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
	searchResultsForQuery,
	fillIn,
} from '../fixtures';

type EditPatientOptions = {
	nn?: string;
	lastname?: string;
	firstname?: string;
	sex?: string;
	birthdate?: Date;
	antecedents?: string;
	ongoing?: string;
	allergies?: string[];
	streetandnumber?: string;
	zip?: string;
	municipality?: string;
	phone?: string[];
	doctors?: string[];
	insurances?: string[];
	about?: string;
	noshow?: number;
	action?: 'Save' | 'Undo';
};

const editPatient = async (
	app,
	{
		nn,
		lastname,
		firstname,
		sex,
		birthdate,
		antecedents,
		ongoing,
		allergies,
		streetandnumber,
		zip,
		municipality,
		phone,
		doctors,
		insurances,
		about,
		noshow,
		action,
	}: EditPatientOptions,
) => {
	const {
		user,
		userWithRealisticTypingSpeed,
		findByRole,
		findAllByRole,
		findByLabelText,
	} = app;
	await user.click(await findByRole('button', {name: /^edit info/i}));

	if (typeof nn === 'string') {
		const matches = await findAllByRole('textbox', {name: 'NISS'});
		const inputs = matches.filter((x) => x.attributes.readonly === undefined);
		assert(inputs.length === 1);
		const input = inputs[0];
		await fillIn(app, input, nn);
	}

	if (typeof lastname === 'string') {
		await fillIn(
			app,
			await findByRole('textbox', {name: 'Last name'}),
			lastname,
		);
	}

	if (typeof firstname === 'string') {
		await fillIn(
			app,
			await findByRole('textbox', {name: 'First name'}),
			firstname,
		);
	}

	if (typeof sex === 'string') {
		await user.click(await findByLabelText('Sex'));
		await user.click(await findByRole('option', {name: sex}));
	}

	if (birthdate instanceof Date) {
		await user.click(await findByLabelText('Birth date'));
		await user.click(
			await findByRole('button', {
				name: 'calendar view is open, go to text input view',
			}),
		);
		await fillIn(
			app,
			await findByLabelText('Birth date'),
			dateFormat(birthdate, 'MM/dd/yyyy'),
		);
		await user.click(await findByRole('button', {name: 'OK'}));
	}

	if (typeof antecedents === 'string') {
		await fillIn(
			app,
			await findByRole('textbox', {name: 'Antécédents'}),
			antecedents,
		);
	}

	if (typeof ongoing === 'string') {
		await fillIn(
			app,
			await findByRole('textbox', {name: 'Traitement en cours'}),
			ongoing,
		);
	}

	if (Array.isArray(allergies)) {
		await userWithRealisticTypingSpeed.type(
			await findByRole('textbox', {name: 'Allergies'}),
			allergies.join('[Enter]') + '[Enter]',
		);
	}

	if (typeof streetandnumber === 'string') {
		await fillIn(
			app,
			await findByRole('textbox', {name: 'Rue et Numéro'}),
			streetandnumber,
		);
	}

	if (typeof zip === 'string') {
		await fillIn(app, await findByRole('textbox', {name: 'Code Postal'}), zip);
	}

	if (typeof municipality === 'string') {
		await fillIn(
			app,
			await findByRole('textbox', {name: 'Commune'}),
			municipality,
		);
	}

	if (Array.isArray(phone)) {
		await userWithRealisticTypingSpeed.type(
			await findByRole('textbox', {name: 'Numéro de téléphone'}),
			phone.join('[Enter]') + '[Enter]',
		);
	}

	if (Array.isArray(doctors)) {
		await userWithRealisticTypingSpeed.type(
			await findByRole('textbox', {name: 'Médecin Traitant'}),
			doctors.join('[Enter]') + '[Enter]',
		);
	}

	if (Array.isArray(insurances)) {
		await userWithRealisticTypingSpeed.type(
			await findByRole('textbox', {name: 'Mutuelle'}),
			insurances.join('[Enter]') + '[Enter]',
		);
	}

	if (typeof about === 'string') {
		await fillIn(app, await findByRole('textbox', {name: 'About'}), about);
	}

	if (typeof noshow === 'number') {
		await fillIn(
			app,
			await findByRole('textbox', {name: 'PVPP (sans RDV)'}),
			noshow.toString(),
		);
	}

	if (typeof action === 'string') {
		console.debug('editPatient', {action});
		await user.click(await findByRole('button', {name: action}));
	}
};

client(__filename, () => {
	it("should allow to edit a patient's personal information", async () => {
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

		await searchForPatient(app, `${lastname} ${firstname}`, {
			name: `${firstname} ${lastname}`,
			id: patientId,
		});

		const {user, findByRole, findByText, findByDisplayValue} = app;

		await editPatient(app, {
			nn: 'my-test-nn',
			firstname: 'Jane',
			sex: 'Female',
			allergies: ['dogs', 'cats', 'nuts'],
			doctors: ['Peter', 'Jack'],
			insurances: ['A&A', 'B&B', 'Workers Union'],
			phone: ['0123456789'],
			streetandnumber: 'my test streetandnumber',
			municipality: 'my test municipality',
			zip: 'my test zip',
			about: 'my test about',
			antecedents: 'my test antecedents',
			ongoing: 'my test ongoing',
			action: 'Save',
		});

		console.debug('Check that patient has been correctly updated');
		await findByDisplayValue('my-test-nn');
		await findByDisplayValue('Doe');
		await findByDisplayValue('Jane');
		await findByText('dogs');
		await findByText('cats');
		await findByText('nuts');
		await findByText('Peter');
		await findByText('Jack');
		await findByText('A&A');
		await findByText('B&B');
		await findByText('Workers Union');
		await findByText('0123456789');
		await findByText('my test streetandnumber');
		await findByText('my test municipality');
		await findByText('my test zip');
		await findByText('my test about');
		await findByText('my test antecedents');
		await findByText('my test ongoing');

		console.debug('Searching for Jane');
		await searchResultsForQuery(app, 'Jane');

		console.debug('Check that gender is female');
		await findByText('F');

		console.debug('Click on Jane Doe link');
		await user.click(await findByRole('link', {name: 'Jane Doe'}));
		console.debug("Check that we are on the patient's record page");
		await findByRole('heading', {name: `/patient/${patientId}`});

		await editPatient(app, {
			firstname: 'John',
			sex: 'Male',
			allergies: ['flowers'],
			streetandnumber: 'my new test streetandnumber',
			municipality: 'my new test municipality',
			noshow: 100,
			action: 'Undo',
		});

		await findByDisplayValue('my-test-nn');
		await findByDisplayValue('Doe');
		await findByDisplayValue('Jane');
		await findByText('dogs');
		await findByText('cats');
		await findByText('nuts');
		await findByText('Peter');
		await findByText('Jack');
		await findByText('A&A');
		await findByText('B&B');
		await findByText('Workers Union');
		await findByText('0123456789');
		await findByText('my test streetandnumber');
		await findByText('my test municipality');
		await findByText('my test zip');
		await findByText('my test about');
		await findByText('my test antecedents');
		await findByText('my test ongoing');

		await searchResultsForQuery(app, 'Jane');

		await findByText('F');
	}).timeout(60_000);
});
