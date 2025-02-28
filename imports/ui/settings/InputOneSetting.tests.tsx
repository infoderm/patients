import React from 'react';

import {assert} from 'chai';
import {faker} from '@faker-js/faker';

import createUserWithPassword from '../../api/user/createUserWithPassword';
import loginWithPassword from '../../api/user/loginWithPassword';
import {client, randomPassword, randomUserId} from '../../_test/fixtures';
import {render} from '../../_test/react';

import {
	TIMEOUT_INPUT_DEBOUNCE,
	TIMEOUT_REACTIVITY_DEBOUNCE,
} from '../constants';
import sleep from '../../lib/async/sleep';

import InputOneSetting from './InputOneSetting';

client(__filename, () => {
	it('should allow the user to type fast', async () => {
		const {fillIn, setupUser} = await import(
			'../../../test/app/client/fixtures'
		);
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);

		const {findByLabelText} = render(
			<InputOneSetting label="test-label" setting="account-holder" />,
		);

		const setting = (await findByLabelText('test-label', {
			selector: 'input:not([disabled])',
		})) as HTMLInputElement;

		assert.strictEqual(setting.value, '');

		const {userWithRealisticTypingSpeed: user} = setupUser();

		const validInput = faker.company.name();

		await fillIn({user}, setting, validInput);

		assert.strictEqual(setting.value, validInput);

		await sleep(TIMEOUT_INPUT_DEBOUNCE + TIMEOUT_REACTIVITY_DEBOUNCE * 2);

		assert.strictEqual(setting.value, validInput);
	}).timeout(10_000);
});
