import React from 'react';

import {assert} from 'chai';
import {faker} from '@faker-js/faker';

import {client, randomPassword, randomUserId} from '../../_test/fixtures';
import {render, waitFor} from '../../_test/react';
import createUserWithPasswordAndLogin from '../../api/user/createUserWithPasswordAndLogin';

import IBANSetting from './IBANSetting';
import {setSetting} from './hooks';

client(__filename, () => {
	it('loads saved value', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);
		const value = faker.finance.iban();
		await setSetting('iban', value);

		const {findByLabelText} = render(<IBANSetting />);

		const iban = (await findByLabelText('IBAN', {
			selector: 'input:not([disabled])',
		})) as HTMLInputElement;

		await waitFor(() => {
			// NOTE: Current implementation has spurious transient states.
			assert.notStrictEqual(iban.value, '');
		});

		// NOTE: Input is enabled once initial value is loaded.
		assert.strictEqual(iban.value, value);
	});

	it.only('sanitizes input when typing', async () => {
		const {fillIn, setupUser} = await import(
			'../../../test/app/client/fixtures'
		);
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const {findByLabelText} = render(<IBANSetting />);

		const iban = (await findByLabelText('IBAN', {
			selector: 'input:not([disabled])',
		})) as HTMLInputElement;

		const {user} = setupUser();

		const validInput = faker.finance.iban({formatted: true});
		await fillIn({user}, iban, validInput);

		assert.strictEqual(iban.value, validInput.replaceAll(' ', ''));
	});

	it.only('sanitizes input when pasting', async () => {
		const {setupUser} = await import('../../../test/app/client/fixtures');
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const {findByLabelText} = render(<IBANSetting />);

		const iban = (await findByLabelText('IBAN', {
			selector: 'input:not([disabled])',
		})) as HTMLInputElement;

		const {user} = setupUser();

		const validInput = faker.finance.iban({formatted: true});
		await user.clear(iban);
		await user.paste(validInput);

		assert.strictEqual(iban.value, validInput.replaceAll(' ', ''));
	});
});
