import React from 'react';

import {ChipProps} from '@material-ui/core/Chip';

import {useAllergy} from '../../api/allergies';
import StaticAllergyChip from './StaticAllergyChip';

interface Tweaks {
	label: string;
}

type ReactiveAllergyChipProps = ChipProps & Tweaks;

const ReactiveAllergyChip = React.forwardRef<any, ReactiveAllergyChipProps>(
	({label, ...rest}, ref) => {
		const {loading, item} = useAllergy(label, [label]);
		return (
			<StaticAllergyChip
				ref={ref}
				loading={loading}
				item={item}
				label={label}
				{...rest}
			/>
		);
	},
);

export default ReactiveAllergyChip;
