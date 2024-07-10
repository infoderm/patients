// eslint-disable-next-line import/order, import/no-unassigned-import
import './polyfill';

import {WebApp} from 'meteor/webapp';

// DECLARE ALL ENABLED API ENDPOINTS
// eslint-disable-next-line import/no-unassigned-import
import '../imports/api/endpoint/_register/enabled';

import atStartup from '../imports/app/atStartup';
import scheduleAllMigrations from '../imports/migrations/scheduleAll';

// DECLARE ALL ENABLED PUBLICATIONS
// eslint-disable-next-line import/no-unassigned-import
import './publication/_register/enabled';

import ics from './api/ics/index';
import healthcheck from './api/healthcheck/index';

// DECLARE ALL ENABLED HTTP ENDPOINTS
WebApp.connectHandlers.use('/api/ics', ics);
WebApp.connectHandlers.use('/api/healthcheck', healthcheck);

atStartup(async () => {
	await scheduleAllMigrations();
});
