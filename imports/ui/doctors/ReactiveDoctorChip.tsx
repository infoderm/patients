import React from 'react';

import {ChipProps} from '@mui/material/Chip';

import StaticDoctorChip from './StaticDoctorChip';

interface Tweaks {
	label: string;
}

type ReactiveDoctorChipProps = ChipProps & Tweaks;

const ReactiveDoctorChip = React.forwardRef<any, ReactiveDoctorChipProps>(
	({label, ...rest}, ref) => (
		<StaticDoctorChip ref={ref} item={{name: label}} label={label} {...rest} />
	),
);

export default ReactiveDoctorChip;
