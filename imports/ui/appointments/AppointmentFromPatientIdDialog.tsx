import React from 'react';
import PropTypes, {InferProps} from 'prop-types';

import usePatient from '../patients/usePatient';
import withLazyOpening from '../modal/withLazyOpening';
import AppointmentDialog from './AppointmentDialog';

const propTypes = {
	patientId: PropTypes.string.isRequired,
};

const AppointmentFromPatientIdDialog = ({
	patientId,
	...rest
}: InferProps<typeof propTypes>) => {
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

AppointmentFromPatientIdDialog.propTypes = propTypes;

export default withLazyOpening(AppointmentFromPatientIdDialog);
