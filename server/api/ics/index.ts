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

const routes = express();
routes.use(rateLimiter);

routes.get('/calendar/:token/events.ics', async (req, res, _next) => {
	const {token} = req.params;
	let permissions;

	try {
		permissions = await getPermissionsForToken(token);
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

	const calendar = ical({name: `Calendar for ${JSON.stringify(userId)}`});

	for (const {_id, ...fields} of Consultations.find({
		owner: {$in: userId},
		isDone: false,
	}).fetch()) {
		const {begin, end, title, isCancelled, uri} = event(_id, fields);
		const path = uri.slice(1);
		calendar.createEvent({
			start: begin,
			end,
			summary: title,
			status: isCancelled ? ICalEventStatus.CANCELLED : null,
			url: Meteor.absoluteUrl(path),
		});
	}

	calendar.serve(res);
});

export default routes;
