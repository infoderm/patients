import React from 'react';

import {ChipProps} from '@material-ui/core/Chip';

import StaticDoctorChip from './StaticDoctorChip';

interface Tweaks {
	label: string;
}

type ReactiveDoctorChipProps = ChipProps & Tweaks;

const ReactiveDoctorChip = React.forwardRef<any, ReactiveDoctorChipProps>(
	({label, ...rest}, ref) => (
		<StaticDoctorChip
			ref={ref}
			item={{_id: undefined, name: label}}
			label={label}
			{...rest}
		/>
	)
);

export default ReactiveDoctorChip;
