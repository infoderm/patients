import process from 'process';

import {AbortController, AbortSignal} from 'node-abort-controller';

import semver from 'semver';

// SEE
// https://www.npmjs.com/package/node-abort-controller?activeTab=readme#nodejs-library-only-supports-node-16-or-above
// https://nodejs.org/api/globals.html#globals_class_abortcontroller
if (semver.gte(process.version, '15.4.0')) {
	throw new Error(
		// eslint-disable-next-line unicorn/prefer-module
		`Remove node-abort-controller polyfill located at '${__filename}'.`,
	);
}

if (Meteor.isServer && !globalThis.fetch) {
	// @ts-expect-error fetch polyfill has incorrect type.
	globalThis.AbortController = AbortController;
	// @ts-expect-error fetch polyfill has incorrect type.
	globalThis.AbortSignal = AbortSignal;
}
