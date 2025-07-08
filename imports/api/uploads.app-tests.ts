import {assert} from 'chai';

import {type FileObj} from 'meteor/ostrio:files';

import {client, randomPassword, randomUserId} from '../_test/fixtures';
import {magic} from '../_test/png';
import absoluteURL from '../app/absoluteURL';
import head from '../util/stream/head';

import sleep from '../util/async/sleep';

import {newUpload} from './_dev/populate/uploads';
import {type MetadataType} from './uploads';
import createUserWithPasswordAndLogin from './user/createUserWithPasswordAndLogin';
import logout from './user/logout';

const uploads = (path: string) => absoluteURL(`cdn/storage/uploads/${path}`);
const original = (upload: FileObj<MetadataType>) =>
	uploads(`${upload._id}/original/${upload.name}`);

client(__filename, () => {
	it('should not be possible to download a document when unauthenticated', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);
		const upload = await newUpload(undefined, {type: 'image/png'});
		await logout();
		await sleep(1000); // NOTE: Wait for session to be GCed.

		const response = await fetch(original(upload));

		assert.strictEqual(response.status, 401);
		assert.strictEqual(await response.text(), 'Access denied!');
	});

	it('should be possible for the owner of a document to download it', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);
		const upload = await newUpload(undefined, {type: 'image/png'});

		const response = await fetch(original(upload));

		assert.strictEqual(response.status, 200);

		const body = response.body;
		assert.isNotNull(body);

		const firstBytes = await head(body, magic.length);

		assert.deepEqual(firstBytes, magic);
	});

	it('should not be possible for someone other than the owner of a document to download it', async () => {
		const usernameA = randomUserId();
		const passwordA = randomPassword();
		await createUserWithPasswordAndLogin(usernameA, passwordA);
		const upload = await newUpload(undefined, {type: 'image/png'});
		await logout();

		const usernameB = randomUserId();
		const passwordB = randomPassword();
		await createUserWithPasswordAndLogin(usernameB, passwordB);

		const response = await fetch(original(upload));

		assert.strictEqual(response.status, 401);
		assert.strictEqual(await response.text(), 'Access denied!');
	});
});
