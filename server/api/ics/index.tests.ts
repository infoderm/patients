// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {Meteor} from 'meteor/meteor';
import {assert} from 'chai';
import request from 'supertest';

import {parse, Component, Event} from 'ical.js';

import isSameDatetime from 'date-fns/isEqual';
import setMilliseconds from 'date-fns/setMilliseconds';
import subWeeks from 'date-fns/subWeeks';

import {zip} from '@iterable-iterator/zip';
import {prop} from '@total-order/key';
import {decreasing} from '@total-order/date';

import {randomUserId, server} from '../../../imports/_test/fixtures';
import {newPatient} from '../../../imports/api/_dev/populate/patients';
import {newConsultation} from '../../../imports/api/_dev/populate/consultations';

import invoke from '../../../imports/api/endpoint/invoke';

import generate from '../../../imports/api/endpoint/permissions/token/generate';
import revoke from '../../../imports/api/endpoint/permissions/token/revoke';

import {ICS_CALENDAR_READ} from '../../../imports/api/permissions/codes';
import {Patients} from '../../../imports/api/collection/patients';
import {decode} from '../../../imports/api/permissions/token';
import {Consultations} from '../../../imports/api/collection/consultations';
import {newAppointment} from '../../../imports/api/_dev/populate/appointments';
import appointmentsBeginConsultation from '../../../imports/api/endpoint/appointments/beginConsultation';
import consultationsRestoreAppointment from '../../../imports/api/endpoint/consultations/restoreAppointment';
import app from './index';

const getEvents = (jCal: any) =>
	new Component(jCal)
		.getAllSubcomponents('vevent')
		.map((sub: any) => new Event(sub));

const getInvocation = () => {
	const userId = randomUserId();
	const connection = {
		clientAddress: '1.2.3.4',
	};

	return {userId, connection};
};

server(__filename, () => {
	it('cannot download past month and upcoming appointments list with invalid token', async () => {
		const token = 'invalid-token';

		const response = await request(app)
			.get(`/appointments/${token}/events.ics`)
			.set('Accept', 'text/calendar');

		assert.equal(response.status, 422);
		assert.equal(response.text, '');
	});

	it('cannot download past month consultations list with invalid token', async () => {
		const token = 'invalid-token';

		const response = await request(app)
			.get(`/consultations/${token}/events.ics`)
			.set('Accept', 'text/calendar');

		assert.equal(response.status, 422);
		assert.equal(response.text, '');
	});

	it('cannot download past month and upcoming appointments list with revoked token', async () => {
		const invocation = getInvocation();

		const permissions = [ICS_CALENDAR_READ];

		const token = await invoke(generate, invocation, [permissions]);

		const {_id} = decode(token);

		await invoke(revoke, invocation, [_id]);

		const response = await request(app)
			.get(`/appointments/${token}/events.ics`)
			.set('Accept', 'text/calendar');

		assert.equal(response.status, 404);
		assert.equal(response.text, '');
	});

	it('cannot download past month consultations list with revoked token', async () => {
		const invocation = getInvocation();

		const permissions = [ICS_CALENDAR_READ];

		const token = await invoke(generate, invocation, [permissions]);

		const {_id} = decode(token);

		await invoke(revoke, invocation, [_id]);

		const response = await request(app)
			.get(`/consultations/${token}/events.ics`)
			.set('Accept', 'text/calendar');

		assert.equal(response.status, 404);
		assert.equal(response.text, '');
	});

	it('cannot download past month and upcoming appointments list with bad permissions', async () => {
		const invocation = getInvocation();

		const permissions = ['bad-permissions'];

		const token = await invoke(generate, invocation, [permissions]);

		const response = await request(app)
			.get(`/appointments/${token}/events.ics`)
			.set('Accept', 'text/calendar');

		assert.equal(response.status, 404);
		assert.equal(response.text, '');
	});

	it('cannot download past month consultations list with bad permissions', async () => {
		const invocation = getInvocation();

		const permissions = ['bad-permissions'];

		const token = await invoke(generate, invocation, [permissions]);

		const response = await request(app)
			.get(`/consultations/${token}/events.ics`)
			.set('Accept', 'text/calendar');

		assert.equal(response.status, 404);
		assert.equal(response.text, '');
	});

	it('can download past month and upcoming appointments list with token', async () => {
		const invocation = getInvocation();
		const irrelevantInvocation = getInvocation();

		const patientId = await newPatient(invocation);
		const patient = await Patients.findOneAsync(patientId);
		assert(patient !== undefined);

		const irrelevantPatientId = await newPatient(irrelevantInvocation);

		const now = new Date();

		await newAppointment(irrelevantInvocation, {
			patient: {_id: irrelevantPatientId},
			datetime: now,
		});

		for (let i = 0; i < 10; ++i) {
			// eslint-disable-next-line no-await-in-loop
			await newConsultation(invocation, {patientId, datetime: now});
		}

		const appointmentAId = await newAppointment(invocation, {
			patient: {_id: patientId},
			datetime: subWeeks(now, 4),
		});

		await newAppointment(irrelevantInvocation, {
			patient: {_id: irrelevantPatientId},
			datetime: now,
		});

		await invoke(appointmentsBeginConsultation, invocation, [appointmentAId]);

		const appointmentBId = await newAppointment(invocation, {
			patient: {_id: patientId},
			datetime: now,
		});

		const appointmentB = await Consultations.findOneAsync(appointmentBId);
		assert(appointmentB !== undefined);

		await invoke(consultationsRestoreAppointment, invocation, [appointmentAId]);

		const appointmentA = await Consultations.findOneAsync(appointmentAId);
		assert(appointmentA !== undefined);

		await newAppointment(irrelevantInvocation, {
			patient: {_id: irrelevantPatientId},
			datetime: now,
		});

		const permissions = [ICS_CALENDAR_READ];

		const token = await invoke(generate, invocation, [permissions]);

		const response = await request(app)
			.get(`/appointments/${token}/events.ics`)
			.set('Accept', 'text/calendar');

		assert.equal(response.status, 200);

		const calendar = parse(response.text);

		const events = getEvents(calendar);

		assert.equal(events.length, 2);

		for (const [event, appointment] of zip(
			events,
			[appointmentA, appointmentB].sort(prop(decreasing, 'lastModifiedAt')),
		)) {
			assert.equal(event.isRecurring(), false);
			assert.equal(event.description, patient.phone);
			assert(
				isSameDatetime(
					event.startDate.toJSDate(),
					setMilliseconds(appointment.begin, 0),
				),
			);
			assert(
				isSameDatetime(
					event.endDate.toJSDate(),
					setMilliseconds(appointment.end, 0),
				),
			);
			assert.equal(event.summary, `${patient.lastname} ${patient.firstname}`);
			assert(
				isSameDatetime(
					event._firstProp('created').toJSDate(),
					setMilliseconds(appointment.createdAt, 0),
				),
			);
			assert(
				isSameDatetime(
					event._firstProp('last-modified').toJSDate(),
					setMilliseconds(appointment.lastModifiedAt, 0),
				),
			);
			assert.equal(
				event._firstProp('url'),
				Meteor.absoluteUrl(`/consultation/${appointment._id}`),
			);
		}
	});

	it('can download past month consultations list with token', async () => {
		const invocation = getInvocation();
		const irrelevantInvocation = getInvocation();

		const patientId = await newPatient(invocation);
		const patient = await Patients.findOneAsync(patientId);
		assert(patient !== undefined);

		const irrelevantPatientId = await newPatient(irrelevantInvocation);

		const now = new Date();

		await newConsultation(irrelevantInvocation, {
			patientId: irrelevantPatientId,
			datetime: now,
		});

		for (let i = 0; i < 10; ++i) {
			// eslint-disable-next-line no-await-in-loop
			await newAppointment(invocation, {
				patient: {_id: patientId},
				datetime: now,
			});
		}

		const {insertedId: consultationAId} = await newConsultation(invocation, {
			patientId,
			datetime: subWeeks(now, 4),
		});

		const consultationA = await Consultations.findOneAsync(consultationAId);
		assert(consultationA !== undefined);

		await newConsultation(irrelevantInvocation, {
			patientId: irrelevantPatientId,
			datetime: now,
		});

		await newConsultation(invocation, {
			patientId,
			datetime: subWeeks(now, 6),
		});

		await newConsultation(irrelevantInvocation, {
			patientId: irrelevantPatientId,
			datetime: now,
		});

		const appointmentId = await newAppointment(invocation, {
			patient: {_id: patientId},
			datetime: now,
		});

		await newConsultation(irrelevantInvocation, {
			patientId: irrelevantPatientId,
			datetime: now,
		});

		await invoke(appointmentsBeginConsultation, invocation, [appointmentId]);

		const consultationBId = appointmentId;

		const consultationB = await Consultations.findOneAsync(consultationBId);
		assert(consultationB !== undefined);

		await newConsultation(irrelevantInvocation, {
			patientId: irrelevantPatientId,
			datetime: now,
		});

		await newConsultation(invocation, {
			patientId,
			datetime: subWeeks(now, 6),
		});

		await newConsultation(irrelevantInvocation, {
			patientId: irrelevantPatientId,
			datetime: now,
		});

		await newConsultation(invocation, {
			patientId,
			datetime: subWeeks(now, 6),
		});

		await newConsultation(irrelevantInvocation, {
			patientId: irrelevantPatientId,
			datetime: now,
		});

		const permissions = [ICS_CALENDAR_READ];

		const token = await invoke(generate, invocation, [permissions]);

		const response = await request(app)
			.get(`/consultations/${token}/events.ics`)
			.set('Accept', 'text/calendar');

		assert.equal(response.status, 200);

		const events = getEvents(parse(response.text));

		assert.equal(events.length, 2);

		for (const [event, consultation] of zip(
			events,
			[consultationB, consultationA].sort(prop(decreasing, 'lastModifiedAt')),
		)) {
			assert.equal(event.isRecurring(), false);
			assert.equal(event.description, patient.phone);
			assert(
				isSameDatetime(
					event.startDate.toJSDate(),
					setMilliseconds(consultation.begin, 0),
				),
			);
			assert(
				isSameDatetime(
					event.endDate.toJSDate(),
					setMilliseconds(consultation.end, 0),
				),
			);
			assert.equal(event.summary, `${patient.lastname} ${patient.firstname}`);
			assert(
				isSameDatetime(
					event._firstProp('created').toJSDate(),
					setMilliseconds(consultation.createdAt, 0),
				),
			);
			assert(
				isSameDatetime(
					event._firstProp('last-modified').toJSDate(),
					setMilliseconds(consultation.lastModifiedAt, 0),
				),
			);
			assert.equal(
				event._firstProp('url'),
				Meteor.absoluteUrl(`/consultation/${consultation._id}`),
			);
		}
	});
});
