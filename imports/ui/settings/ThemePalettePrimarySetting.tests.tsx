import React from 'react';

import {assert} from 'chai';

import {faker} from '@faker-js/faker';

import createUserWithPassword from '../../api/user/createUserWithPassword';
import loginWithPassword from '../../api/user/loginWithPassword';
import {client, randomPassword, randomUserId} from '../../_test/fixtures';
import {render, waitFor} from '../../_test/react';

import {setSetting} from './hooks';

import ThemePalettePrimarySetting from './ThemePalettePrimarySetting';

client(__filename, () => {
	it('loads saved value', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);
		const value = faker.color.rgb();
		await setSetting('theme-palette-primary', value);

		const {findByRole} = render(<ThemePalettePrimarySetting />);

		const button = await findByRole('button', {
			name: 'Primary color for theme',
		});

		await waitFor(() => {
			// NOTE: Current implementation has spurious transient states.
			assert.strictEqual(button.textContent, value);
		});
	});
});
