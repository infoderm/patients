import React from 'react';

import {ChipProps} from '@mui/material/Chip';

import StaticInsuranceChip from './StaticInsuranceChip';

interface Tweaks {
	label: string;
}

type ReactiveInsuranceChipProps = ChipProps & Tweaks;

const ReactiveInsuranceChip = React.forwardRef<any, ReactiveInsuranceChipProps>(
	({label, ...rest}, ref) => (
		<StaticInsuranceChip
			ref={ref}
			item={{name: label}}
			label={label}
			{...rest}
		/>
	),
);

export default ReactiveInsuranceChip;
