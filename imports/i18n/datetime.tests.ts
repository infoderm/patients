import {assert} from 'chai';

import {client, randomPassword, randomUserId} from '../_test/fixtures';
import {renderHook, waitFor} from '../_test/react';

import createUserWithPasswordAndLogin from '../api/user/createUserWithPasswordAndLogin';
import update from '../api/endpoint/settings/update';
import call from '../api/endpoint/call';

import {useDateFormat} from './datetime';

const referenceDate = new Date('2006-01-02T15:04:05-0700');

client(__filename, () => {
	it('should render when logged out', async () => {
		const {result} = renderHook(() => {
			const format = useDateFormat('PPPPpppp');
			return format(referenceDate);
		});
		assert.strictEqual(
			result.current,
			'Monday, January 2nd, 2006 at 11:04:05 PM GMT+01:00',
		);
	});

	it('should render when logged in', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const {result} = renderHook(() => {
			const format = useDateFormat('PPP');
			return format(referenceDate);
		});
		assert.strictEqual(result.current, 'January 2nd, 2006');
	});

	it('should have aggregate on load', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		await call(update, 'lang', 'fr-BE');

		const {result} = renderHook(() => {
			const format = useDateFormat();
			return format(referenceDate);
		});

		await waitFor(() => {
			assert.strictEqual(result.current, '2 janv. 2006');
		});
	});

	it('should react to changes', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		await call(update, 'lang', 'nl-BE');

		const {result} = renderHook(() => {
			const format = useDateFormat();
			return format(referenceDate);
		});

		await waitFor(() => {
			assert.strictEqual(result.current, '2 jan. 2006');
		});

		await call(update, 'lang', 'en-US');

		await waitFor(() => {
			assert.strictEqual(result.current, 'Jan 2, 2006');
		});
	});
});
