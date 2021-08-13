import React from 'react';
import PropTypes, {InferProps} from 'prop-types';

import StaticPatientChip from './StaticPatientChip';

import usePatient from './usePatient';

const ReactivePatientChipPropTypes = {
	...StaticPatientChip.propTypes,
	patient: PropTypes.shape({
		_id: PropTypes.string.isRequired,
	}).isRequired,
};

type ReactivePatientChipProps = InferProps<typeof ReactivePatientChipPropTypes>;

const ReactivePatientChip = ({patient, ...rest}: ReactivePatientChipProps) => {
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

	const props = {...rest, loading, found, patient: fields};

	return <StaticPatientChip {...props} />;
};

ReactivePatientChip.projection = {
	_id: 1,
};

ReactivePatientChip.propTypes = ReactivePatientChipPropTypes;

export default ReactivePatientChip;
