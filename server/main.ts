// eslint-disable-next-line import/order, import/no-unassigned-import
import './polyfill';

import {WebApp} from 'meteor/webapp';
import {Accounts} from 'meteor/accounts-base';

// DECLARE ALL ENABLED API ENDPOINTS
// eslint-disable-next-line import/no-unassigned-import
import '../imports/api/endpoint/_register/enabled';

import atStartup from '../imports/app/atStartup';
import isTest from '../imports/app/isTest';
import scheduleAllMigrations from '../imports/migrations/scheduleAll';

// DECLARE ALL ENABLED PUBLICATIONS
// eslint-disable-next-line import/no-unassigned-import
import './publication/_register/enabled';

import ics from './api/ics/index';

// DECLARE ALL ENABLED ICS ENDPOINTS
WebApp.connectHandlers.use('/api/ics', ics);

if (isTest()) {
	// @ts-expect-error Missing from type definitions.
	Accounts.removeDefaultRateLimit();
}

atStartup(async () => {
	await scheduleAllMigrations();
});
