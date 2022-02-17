import React from 'react';

import usePatient from '../patients/usePatient';
import withLazyOpening from '../modal/withLazyOpening';
import PropsOf from '../../util/PropsOf';
import AppointmentDialog from './AppointmentDialog';

interface AppointmentFromPatientIdDialogProps
	extends Omit<PropsOf<typeof AppointmentDialog>, 'initialPatient'> {
	patientId: string;
}

const AppointmentFromPatientIdDialog = ({
	patientId,
	...rest
}: AppointmentFromPatientIdDialogProps) => {
	const options = {fields: {firstname: 1, lastname: 1, phone: 1}};

	const deps = [patientId, JSON.stringify(options.fields)];

	const {loading, found, fields} = usePatient(
		{_id: patientId},
		patientId,
		options,
		deps,
	);

	const patient = loading
		? {_id: patientId, lastname: 'loading', firstname: '...'}
		: found
		? fields
		: {_id: patientId, lastname: 'NOT', firstname: 'FOUND'};

	return <AppointmentDialog initialPatient={patient} {...rest} />;
};

export default withLazyOpening(AppointmentFromPatientIdDialog);
