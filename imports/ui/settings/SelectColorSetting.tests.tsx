import React from 'react';

import {assert} from 'chai';

import {range} from '@iterable-iterator/range';
import {map} from '@iterable-iterator/map';
import {list} from '@iterable-iterator/list';

import {faker} from '@faker-js/faker';

import createUserWithPassword from '../../api/user/createUserWithPassword';
import loginWithPassword from '../../api/user/loginWithPassword';
import {client, randomPassword, randomUserId} from '../../_test/fixtures';
import {render, waitFor} from '../../_test/react';

import {
	TIMEOUT_INPUT_DEBOUNCE,
	TIMEOUT_REACTIVITY_DEBOUNCE,
} from '../constants';
import sleep from '../../lib/async/sleep';

import SelectColorSetting from './SelectColorSetting';
import {setSetting} from './hooks';

client(__filename, () => {
	it('should debounce user input', async () => {
		const {setupUser} = await import('../../../test/app/client/fixtures');
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);

		const {findByRole} = render(
			<SelectColorSetting aria-label="Color" setting="theme-palette-primary" />,
		);

		const button = await findByRole('button', {
			name: 'Color',
		});
		const {user} = setupUser();

		await user.click(button);
		const hex = await findByRole('textbox', {name: 'hex'});

		const n = 10;
		const validInputs = list(
			map(() => faker.color.rgb().toUpperCase(), range(n)),
		);

		// NOTE: Trigger a sequence of updates.
		for (const validInput of validInputs) {
			// eslint-disable-next-line no-await-in-loop
			await sleep(5);
			// eslint-disable-next-line no-await-in-loop
			await user.clear(hex);
			// eslint-disable-next-line no-await-in-loop
			await user.paste(validInput);
		}

		assert.strictEqual(button.textContent?.toUpperCase(), validInputs.at(-1));

		await sleep(TIMEOUT_INPUT_DEBOUNCE + TIMEOUT_REACTIVITY_DEBOUNCE * 2);

		assert.strictEqual(button.textContent?.toUpperCase(), validInputs.at(-1));
	}).timeout(10_000);

	it('allows to reset setting to default', async () => {
		const {setupUser} = await import('../../../test/app/client/fixtures');
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);

		const {findByRole} = render(
			<SelectColorSetting
				aria-label="Color"
				setting="theme-palette-secondary"
			/>,
		);

		const button = await findByRole('button', {
			name: 'Color',
		});

		const defaultValue = button.textContent;

		const value = faker.color.rgb();
		await setSetting('theme-palette-secondary', value);

		await waitFor(() => {
			assert.strictEqual(button.textContent, value);
		});

		const reset = await findByRole('button', {
			name: 'Reset color',
		});

		const {user} = setupUser();
		await user.click(reset);

		await waitFor(() => {
			assert.strictEqual(button.textContent, defaultValue);
		});
	});
});
