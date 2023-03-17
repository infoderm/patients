import assert from 'assert';
import React from 'react';

import withLazyOpening from '../modal/withLazyOpening';
import reschedule from '../../api/endpoint/appointments/reschedule';
import useCall from '../action/useCall';
import {type AppointmentDocument} from '../../api/collection/appointments';
import {type AppointmentUpdate} from '../../api/appointments';
import {type Entry} from '../../api/update';
import AppointmentFromPatientIdDialog from './AppointmentFromPatientIdDialog';

type Props = {
	open: boolean;
	onClose: () => void;
	appointment: AppointmentDocument;
};

const appointmentDiffGen = function* (
	appointment: AppointmentDocument,
	update: AppointmentUpdate,
): IterableIterator<Entry<AppointmentUpdate>> {
	assert(update.patient !== undefined);

	if (
		JSON.stringify(update.datetime) !== JSON.stringify(appointment.datetime) ||
		update.duration !== appointment.duration
	) {
		yield ['datetime', update.datetime];
		yield ['duration', update.duration];
	}

	if (update.patient._id !== appointment.patientId) {
		yield ['patient', update.patient];
		if (update.patient._id === '?') {
			yield ['phone', update.phone];
		}
	}

	if (update.reason !== appointment.reason) {
		yield ['reason', update.reason];
	}
};

const appointmentDiff = (
	appointment: AppointmentDocument,
	update: AppointmentUpdate,
): Partial<AppointmentUpdate> => {
	const entries = appointmentDiffGen(appointment, update);
	// @ts-expect-error Too complex to fix.
	return Object.fromEntries(entries);
};

const EditAppointmentDialog = ({open, onClose, appointment}: Props) => {
	const [call, {pending}] = useCall();
	const onSubmit = async (update: AppointmentUpdate) => {
		const diff = appointmentDiff(appointment, update);
		console.debug('onSubmit', diff);
		return call(reschedule, appointment._id, diff);
	};

	return (
		<AppointmentFromPatientIdDialog
			patientId={appointment.patientId}
			open={open}
			initialDatetime={appointment.datetime}
			initialAppointment={appointment}
			pending={pending}
			onClose={onClose}
			onSubmit={onSubmit}
		/>
	);
};

export default withLazyOpening(EditAppointmentDialog);
