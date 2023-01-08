import React from 'react';

import {Link} from 'react-router-dom';

import Chip, {type ChipProps} from '@mui/material/Chip';

import {myEncodeURIComponent} from '../../util/uri';

import {type InsuranceFields} from '../../api/collection/insurances';

type AddedProps = {
	item: InsuranceFields;
};

type StaticInsuranceChipProps = ChipProps & AddedProps;

const StaticInsuranceChip = React.forwardRef<any, StaticInsuranceChipProps>(
	({item, ...rest}, ref) => {
		let style: React.CSSProperties;
		let component: React.ElementType;
		let to: string;

		if (item && !rest.onDelete) {
			component = Link;
			to = `/insurance/${myEncodeURIComponent(item.name)}`;
			style = {cursor: 'pointer'};
		}

		return (
			<Chip ref={ref} {...rest} style={style} component={component} to={to} />
		);
	},
);

export default StaticInsuranceChip;
