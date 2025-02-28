import React from 'react';

import {faker} from '@faker-js/faker';

import {assert} from 'chai';

import {BrowserRouter} from 'react-router-dom';

import call from '../../api/endpoint/call';
import createUserWithPassword from '../../api/user/createUserWithPassword';
import loginWithPassword from '../../api/user/loginWithPassword';
import {client, randomPassword, randomUserId} from '../../_test/fixtures';
import {newPatientFormData} from '../../api/_dev/populate/patients';

import patientsInsert from '../../api/endpoint/patients/insert';
import {render} from '../../_test/react';

import {type FormattedLine, type NormalizedLine} from '../../api/string';

import ReactiveAllergyCard from './ReactiveAllergyCard';

client(__filename, () => {
	it("should allow to change allergy's color", async () => {
		const {setupUser} = await import('../../../test/app/client/fixtures');
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);

		const allergy = {
			displayName: 'Orange' as FormattedLine,
			name: 'orange' as NormalizedLine,
		};

		await call(
			patientsInsert,
			newPatientFormData({
				allergies: [allergy],
			}),
		);

		const {findByRole} = render(
			<BrowserRouter>
				<ReactiveAllergyCard item={allergy} />
			</BrowserRouter>,
		);

		const button = await findByRole('button', {name: 'Color for orange'});

		const {user} = setupUser();

		await user.click(button);
		const hex = await findByRole('textbox', {name: 'hex'});

		const validInput = faker.color.rgb().toUpperCase();

		await user.clear(hex);
		await user.paste(validInput);

		assert.strictEqual(button.textContent?.toUpperCase(), validInput);
	});
});
