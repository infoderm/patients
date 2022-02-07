import React from 'react';

import {Link} from 'react-router-dom';

import Chip, {ChipProps} from '@mui/material/Chip';

import {myEncodeURIComponent} from '../../util/uri';

import {DoctorFields} from '../../api/collection/doctors';

interface AddedProps {
	item: DoctorFields;
}

type StaticDoctorChipProps = ChipProps & AddedProps;

const StaticDoctorChip = React.forwardRef<any, StaticDoctorChipProps>(
	({item, ...rest}, ref) => {
		let style: React.CSSProperties;
		let component: React.ElementType;
		let to: string;

		if (item && !rest.onDelete) {
			component = Link;
			to = `/doctor/${myEncodeURIComponent(item.name)}`;
			style = {cursor: 'pointer'};
		}

		return (
			<Chip ref={ref} {...rest} style={style} component={component} to={to} />
		);
	},
);

export default StaticDoctorChip;
