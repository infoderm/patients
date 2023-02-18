import process from 'process';
import {Meteor} from 'meteor/meteor';
import express from 'express';
import ical, {ICalEventStatus} from 'ical-generator';

import subWeeks from 'date-fns/subWeeks';
import startOfWeek from 'date-fns/startOfWeek';

import {Consultations} from '../../../imports/api/collection/consultations';

import {
	getPermissionsForToken,
	PermissionTokenValidationError,
} from '../../../imports/api/permissions/token';
import {ICS_CALENDAR_READ} from '../../../imports/api/permissions/codes';

import {event} from '../../../imports/api/events';
import {getWeekStartsOn} from '../../../imports/i18n/datetime';

import rateLimiter from './rateLimiter';

const cache = new Map(); // TODO allow to clear cache / use LRU cache

const filename = 'events.ics';

const response = async (token, IPAddress, query, res) => {
	let permissions;

	try {
		// NOTE this is a transaction
		permissions = await getPermissionsForToken(
			token,
			IPAddress,
			ICS_CALENDAR_READ,
		);
	} catch (error: unknown) {
		if (error instanceof PermissionTokenValidationError) {
			res.writeHead(error.getHTTPErrorCode()).end();
			return;
		}

		throw error;
	}

	// NOTE no need for a transaction for the rest, for now

	const {owner, userId} = permissions;

	if (owner === undefined || userId === undefined || userId.length === 0) {
		res.writeHead(503).end();
		return;
	}

	const weekStartsOn = await getWeekStartsOn(owner);

	const startDate = subWeeks(startOfWeek(new Date(), {weekStartsOn}), 4);

	const selector = {
		...query,
		owner: {$in: userId},
		end: {$gte: startDate},
	};

	const lastModified = await Consultations.findOneAsync(selector, {
		sort: {lastModifiedAt: -1},
	});

	if (!lastModified) {
		ical({name: `Calendar for ${JSON.stringify(userId)}`}).serve(res);
		return;
	}

	const cacheKey = JSON.stringify(selector);

	if (
		!cache.has(cacheKey) ||
		cache.get(cacheKey).lastModifiedAt < lastModified.lastModifiedAt
	) {
		const calendar = ical({name: `Calendar for ${JSON.stringify(userId)}`});

		await Consultations.find(selector, {
			sort: {lastModifiedAt: -1},
		}).forEachAsync(({_id, ...fields}) => {
			const {begin, end, title, description, isCancelled, uri} = event(
				_id,
				fields,
			);
			const path = uri.slice(1);
			calendar.createEvent({
				start: begin,
				end,
				description,
				created: fields.createdAt,
				lastModified: fields.lastModifiedAt,
				summary: title,
				status: isCancelled ? ICalEventStatus.CANCELLED : null,
				url: Meteor.absoluteUrl(path),
			});
		});

		cache.set(cacheKey, {
			lastModifiedAt: lastModified.lastModifiedAt,
			body: calendar.toString(),
		});
	}

	const {lastModifiedAt, body} = cache.get(cacheKey);

	res
		.set({
			'Last-Modified': lastModifiedAt.toUTCString(),
			'Content-Type': 'text/calendar; charset=utf-8',
			'Content-Disposition': `attachment; filename="${filename}"`,
		})
		.send(body);
};

const routes = express();

routes.set('trust proxy', process.env.HTTP_FORWARDED_COUNT);

routes.use(rateLimiter);

routes.get(`/appointments/:token/${filename}`, async (req, res, _next) => {
	const {token} = req.params;
	const query = {isDone: false};
	await response(token, req.ip, query, res);
});

routes.get(`/consultations/:token/${filename}`, async (req, res, _next) => {
	const {token} = req.params;
	const query = {isDone: true};
	await response(token, req.ip, query, res);
});

export default routes;
