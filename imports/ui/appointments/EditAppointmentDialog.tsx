import React from 'react';

import withLazyOpening from '../modal/withLazyOpening';
import reschedule from '../../api/endpoint/appointments/reschedule';
import useCall from '../action/useCall';
import {AppointmentDocument} from '../../api/collection/appointments';
import {AppointmentUpdate} from '../../api/appointments';
import {Entry} from '../../api/update';
import AppointmentFromPatientIdDialog from './AppointmentFromPatientIdDialog';

interface Props {
	open: boolean;
	onClose: () => void;
	appointment: AppointmentDocument;
}

const appointmentDiffGen = function* (
	appointment: AppointmentDocument,
	update: AppointmentUpdate,
): IterableIterator<Entry<AppointmentUpdate>> {
	if (
		JSON.stringify(update.datetime) !== JSON.stringify(appointment.datetime) ||
		update.duration !== appointment.duration
	) {
		yield ['datetime', update.datetime];
		yield ['duration', update.duration];
	}

	if (update.patient._id !== appointment.patientId) {
		yield [
			'patient',
			{
				_id: update.patient._id,
			},
		];
		if (update.patient._id === '?') {
			yield [
				'patient',
				{
					_id: update.patient._id,
					firstname: update.patient.firstname,
					lastname: update.patient.lastname,
				},
			];
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
	return Object.fromEntries(appointmentDiffGen(appointment, update));
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
