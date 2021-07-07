import React from 'react';

import {ChipProps} from '@material-ui/core/Chip';

import StaticInsuranceChip from './StaticInsuranceChip';

interface Tweaks {
	label: string;
}

type ReactiveInsuranceChipProps = ChipProps & Tweaks;

const ReactiveInsuranceChip = React.forwardRef<any, ReactiveInsuranceChipProps>(
	({label, ...rest}, ref) => (
		<StaticInsuranceChip
			ref={ref}
			item={{_id: undefined, name: label}}
			label={label}
			{...rest}
		/>
	)
);

export default ReactiveInsuranceChip;
