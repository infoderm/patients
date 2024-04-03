import process from 'process';

import express from 'express';

import isProduction from '../../../imports/app/isProduction';
import isReady from '../../../imports/app/isReady';

import {pipe} from '../rateLimit';

import rateLimiter from './rateLimiter';

const routes = express();

routes.set('trust proxy', process.env.HTTP_FORWARDED_COUNT);

if (isProduction()) {
	routes.use(pipe(rateLimiter));
}

routes.get(`/`, async (_req, res, _next) => {
	await isReady();
	res.status(200).send('OK');
});

export default routes;
