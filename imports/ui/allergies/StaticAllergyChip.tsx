import React from 'react';

import {Link} from 'react-router-dom';

import {type ChipProps} from '@mui/material/Chip';

import {myEncodeURIComponent} from '../../lib/uri';

import {type AllergyDocument} from '../../api/collection/allergies';
import ColorChip from '../chips/ColorChip';

type AddedProps =
	| {loading: true; item: undefined}
	| {loading: false; item: AllergyDocument};

type StaticAllergyChipProps<C extends React.ElementType> = ChipProps<C> &
	AddedProps;

const StaticAllergyChip = React.forwardRef(
	<C extends React.ElementType>(
		{loading = false, item, ...rest}: StaticAllergyChipProps<C>,
		ref: React.Ref<any>,
	) => {
		let component: C | typeof Link | undefined;
		let to: string | undefined;

		const clickable = Boolean(item && !rest.onDelete);

		if (clickable) {
			component = Link;
			to = `/allergy/${myEncodeURIComponent(item!.name)}`;
		}

		return (
			<ColorChip
				ref={ref}
				color={loading ? undefined : item?.color}
				{...rest}
				component={component}
				to={to}
				clickable={clickable ? true : undefined}
			/>
		);
	},
);

export default StaticAllergyChip;
