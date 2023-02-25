import React from 'react';

import type PropsOf from '../../lib/types/PropsOf';
import StaticPatientChip, {
	projection as StaticPatientChipProjection,
} from './StaticPatientChip';

import usePatient from './usePatient';

type Props = {
	patient: {_id: string};
} & PropsOf<typeof StaticPatientChip>;

const ReactivePatientChip = React.forwardRef(
	({patient, ...rest}: Props, ref) => {
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

export default ReactivePatientChip;

export const projection = {
	_id: 1,
};
