import {Meteor} from 'meteor/meteor';
import express from 'express';
import ical, {ICalEventStatus} from 'ical-generator';

import {Consultations} from '../../../imports/api/collection/consultations';
import {event} from '../../../imports/api/events';
import {
	getPermissionsForToken,
	PermissionTokenValidationError,
} from '../../../imports/api/permissions/token';
import rateLimiter from './rateLimiter';

const cache = new Map(); // TODO allow to clear cache / use LRU cache

const routes = express();

routes.set('trust proxy', 1);

routes.use(rateLimiter);
const filename = 'events.ics';
routes.get(`/calendar/:token/${filename}`, async (req, res, _next) => {
	const {token} = req.params;
	let permissions;

	try {
		permissions = await getPermissionsForToken(token, req.ip);
	} catch (error: unknown) {
		if (error instanceof PermissionTokenValidationError) {
			res.writeHead(error.getHTTPErrorCode()).end();
			return;
		}

		throw error;
	}

	const {userId} = permissions;

	if (userId === undefined || userId.length === 0) {
		res.writeHead(503).end();
		return;
	}

	const query = {
		owner: {$in: userId},
		isDone: false,
	};

	const lastModified = Consultations.findOne(query, {
		sort: {lastModifiedAt: -1},
	});

	const cacheKey = JSON.stringify(query);

	if (
		!cache.has(cacheKey) ||
		cache.get(cacheKey).lastModifiedAt < lastModified.lastModifiedAt
	) {
		const calendar = ical({name: `Calendar for ${JSON.stringify(userId)}`});

		Consultations.find(query, {sort: {lastModifiedAt: -1}}).forEach(
			({_id, ...fields}) => {
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
			},
		);

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
});

export default routes;
