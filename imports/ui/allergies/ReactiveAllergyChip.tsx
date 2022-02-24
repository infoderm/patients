import React from 'react';

import {ChipProps} from '@mui/material/Chip';

import {useAllergy} from '../../api/allergies';
import {PatientTag} from '../../api/collection/patients';
import StaticAllergyChip from './StaticAllergyChip';

interface Tweaks {
	item: PatientTag;
}

type ReactiveAllergyChipProps = ChipProps & Tweaks;

const ReactiveAllergyChip = React.forwardRef<any, ReactiveAllergyChipProps>(
	({item, ...rest}, ref) => {
		const {loading, item: allergy} = useAllergy(item.name, [item.name]);
		return (
			<StaticAllergyChip ref={ref} loading={loading} item={allergy} {...rest} />
		);
	},
);

export default ReactiveAllergyChip;
