import {assert} from 'chai';

import {client, randomPassword, randomUserId} from '../_test/fixtures';
import {renderHook, waitFor} from '../_test/react';

import createUserWithPasswordAndLogin from '../api/user/createUserWithPasswordAndLogin';
import update from '../api/endpoint/settings/update';
import call from '../api/endpoint/call';

import {useLocaleText} from './dataGrid';

client(__filename, () => {
	it('should render when logged out', async () => {
		const {result} = renderHook(useLocaleText);
		assert.strictEqual(result.current, undefined);
	});

	it('should render when logged in', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const {result} = renderHook(useLocaleText);
		assert.strictEqual(result.current, undefined);
	});

	it('should have aggregate on load', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		await call(update, 'lang', 'fr-BE');

		const {result} = renderHook(useLocaleText);

		await waitFor(() => {
			assert.strictEqual(result.current?.noRowsLabel, 'Pas de résultats');
		});
	});

	it('should react to changes', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		await call(update, 'lang', 'nl-BE');

		const {result} = renderHook(useLocaleText);

		await waitFor(() => {
			assert.strictEqual(result.current?.noRowsLabel, 'Geen resultaten.');
		});

		await call(update, 'lang', 'en-US');

		await waitFor(() => {
			assert.strictEqual(result.current, undefined);
		});
	});
});
