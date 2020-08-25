import React from 'react';

import StaticPatientChip from './StaticPatientChip.js';

import {usePatient} from '../../api/patients.js';

const ReactivePatientChip = ({patient, ...props}) => {
	const patientId = patient._id;
	const options = {fields: StaticPatientChip.projection};

	const deps = [
		patientId,
		JSON.stringify(patient),
		JSON.stringify(StaticPatientChip.projection)
	];

	const {loading, found, fields} = usePatient(
		patient,
		patientId,
		options,
		deps
	);
	props = {...props, loading, found, patient: fields};

	return <StaticPatientChip {...props} />;
};

ReactivePatientChip.projection = {
	_id: 1
};

export default ReactivePatientChip;
