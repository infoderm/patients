import React from 'react';
import PropTypes from 'prop-types';

import StaticPatientChip from './StaticPatientChip';

import usePatient from './usePatient';

const ReactivePatientChip = ({patient, ...props}) => {
	const patientId = patient._id;
	const options = {fields: StaticPatientChip.projection};

	const deps = [
		patientId,
		JSON.stringify(patient),
		JSON.stringify(StaticPatientChip.projection),
	];

	const {loading, found, fields} = usePatient(
		patient,
		patientId,
		options,
		deps,
	);
	props = {...props, loading, found, patient: fields};

	return <StaticPatientChip {...props} />;
};

ReactivePatientChip.propTypes = {
	patient: PropTypes.object.isRequired,
};

ReactivePatientChip.projection = {
	_id: 1,
};

export default ReactivePatientChip;
