import React from 'react';

import {assert} from 'chai';
import {faker} from '@faker-js/faker';

import {client, randomPassword, randomUserId} from '../../_test/fixtures';
import {render} from '../../_test/react';
import createUserWithPasswordAndLogin from '../../api/user/createUserWithPasswordAndLogin';

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
		await createUserWithPasswordAndLogin(username, password);

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
