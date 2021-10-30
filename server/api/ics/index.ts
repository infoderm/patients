import {Meteor} from 'meteor/meteor';
import express from 'express';
import ical, {ICalEventStatus} from 'ical-generator';
import {Consultations} from '../../../imports/api/collection/consultations';
import {PermissionTokens} from '../../../imports/api/collection/permissionTokens';

import {event} from '../../../imports/api/events';
import {decode} from '../../../imports/api/permissions/token';
import {SignedDocument, verify} from '../../../imports/lib/hmac';
import {ICS_CALENDAR_READ} from '../../../imports/api/permissions/codes';
import rateLimiter from './rateLimiter';

const routes = express();
routes.use(rateLimiter);

const extractPermissions = ({_id, ...rest}) => rest;

routes.get('/api/ics/calendar/:token/events.ics', async (req, res, _next) => {
	const {token} = req.params;
	let decoded;
	try {
		decoded = decode(token);
	} catch {
		res.writeHead(422);
		res.end();
		return;
	}

	const {_id, key} = decoded;

	if (typeof _id !== 'string' || typeof key !== 'string') {
		res.writeHead(422);
		res.end();
		return;
	}

	const now = new Date();

	const document = PermissionTokens.findOne({
		_id,
		permissions: ICS_CALENDAR_READ,
		validFrom: {$lte: now},
		validUntil: {$gt: now}, // TODO use mongo's internal Date?
	});

	if (!document) {
		res.writeHead(404);
		res.end();
		return;
	}

	const permissions = extractPermissions(document); // _id is not part of signature

	const signatureIsValid: boolean = await verify(
		key,
		permissions as SignedDocument,
	);
	if (!signatureIsValid) {
		// res.writeHead(401); // see https://stackoverflow.com/q/45153773 and https://stackoverflow.com/a/1960453
		res.writeHead(404 /* stealth, although timing side-channel is exposed */);
		res.end();
		return;
	}

	const {userId} = permissions;

	if (userId === undefined || userId.length === 0) {
		res.writeHead(503);
		res.end();
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
