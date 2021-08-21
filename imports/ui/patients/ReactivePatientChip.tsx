import React from 'react';
import PropTypes, {InferProps} from 'prop-types';

import StaticPatientChip, {
	projection as StaticPatientChipProjection,
} from './StaticPatientChip';

import usePatient from './usePatient';

const ReactivePatientChipPropTypes = {
	...StaticPatientChip.propTypes,
	patient: PropTypes.shape({
		_id: PropTypes.string.isRequired,
	}).isRequired,
};

type ReactivePatientChipProps = InferProps<typeof ReactivePatientChipPropTypes>;

const ReactivePatientChip = React.forwardRef(
	({patient, ...rest}: ReactivePatientChipProps, ref) => {
		const patientId = patient._id;
		const options = {fields: StaticPatientChipProjection};

		const deps = [
			patientId,
			JSON.stringify(patient),
			JSON.stringify(StaticPatientChipProjection),
		];

		const {loading, found, fields} = usePatient(
			patient,
			patientId,
			options,
			deps,
		);

		const props = {...rest, loading, found, patient: fields};

		return <StaticPatientChip ref={ref} {...props} />;
	},
);

ReactivePatientChip.propTypes = ReactivePatientChipPropTypes;

export default ReactivePatientChip;

export const projection = {
	_id: 1,
};
