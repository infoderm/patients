import React from 'react';

import {Link} from 'react-router-dom';

import Chip, {type ChipProps} from '@mui/material/Chip';

import {myEncodeURIComponent} from '../../lib/uri';

import {type InsuranceFields} from '../../api/collection/insurances';

type AddedProps = {
	item: InsuranceFields;
};

type StaticInsuranceChipProps<C extends React.ElementType> = ChipProps<C> &
	AddedProps;

const StaticInsuranceChip = React.forwardRef(
	<C extends React.ElementType>(
		{item, ...rest}: StaticInsuranceChipProps<C>,
		ref: React.Ref<any>,
	) => {
		let style: React.CSSProperties | undefined;
		let component: C | typeof Link | undefined;
		let to: string | undefined;

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
