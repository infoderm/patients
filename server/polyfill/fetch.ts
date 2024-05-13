// SEE
// https://github.com/node-fetch/node-fetch/blob/8b3320d2a7c07bce4afc6b2bf6c3bbddda85b01f/README.md#providing-global-access

import process from 'process';

import fetch, {Blob, Headers, Request, Response} from 'node-fetch';

import semver from 'semver';

if (semver.gte(process.version, '18.0.0')) {
	// eslint-disable-next-line unicorn/prefer-module
	throw new Error(`Remove node-fetch polyfill located at '${__filename}'.`);
}

if (Meteor.isServer && !globalThis.fetch) {
	// @ts-expect-error fetch polyfill has incorrect type.
	globalThis.fetch = fetch;
	globalThis.Blob = Blob;
	// @ts-expect-error Headers polyfill has incorrect type.
	globalThis.Headers = Headers;
	// @ts-expect-error Request polyfill has incorrect type.
	globalThis.Request = Request;
	// @ts-expect-error Response polyfill has incorrect type.
	globalThis.Response = Response;
}
