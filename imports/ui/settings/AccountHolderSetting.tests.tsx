import React from 'react';

import {assert} from 'chai';
import {faker} from '@faker-js/faker';

import {client, randomPassword, randomUserId} from '../../_test/fixtures';
import {render, waitFor} from '../../_test/react';
import createUserWithPasswordAndLogin from '../../api/user/createUserWithPasswordAndLogin';

import {setSetting} from './hooks';
import AccountHolderSetting from './AccountHolderSetting';

client(__filename, () => {
	it('loads saved value', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);
		const value = faker.company.name();
		await setSetting('account-holder', value);

		const {findByLabelText} = render(<AccountHolderSetting />);

		const accountHolder = (await findByLabelText('Account Holder', {
			selector: 'input:not([disabled])',
		})) as HTMLInputElement;

		await waitFor(() => {
			// NOTE: Current implementation has spurious transient states.
			assert.notStrictEqual(accountHolder.value, '');
		});

		// NOTE: Input is enabled once initial value is loaded.
		assert.strictEqual(accountHolder.value, value);
	});
});
