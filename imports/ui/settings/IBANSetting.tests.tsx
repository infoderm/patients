import React from 'react';

import {assert} from 'chai';
import {faker} from '@faker-js/faker';

import createUserWithPassword from '../../api/user/createUserWithPassword';
import loginWithPassword from '../../api/user/loginWithPassword';
import {client, randomPassword, randomUserId} from '../../_test/fixtures';
import {render, waitFor} from '../../_test/react';

import IBANSetting from './IBANSetting';
import {setSetting} from './hooks';

client(__filename, () => {
	it('loads saved value', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);
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
});
