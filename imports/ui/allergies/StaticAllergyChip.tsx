import React from 'react';

import {Link} from 'react-router-dom';

import {ChipProps} from '@mui/material/Chip';

import {myEncodeURIComponent} from '../../util/uri';

import {AllergyDocument} from '../../api/collection/allergies';
import ColorChip from '../chips/ColorChip';

interface AddedProps {
	loading?: boolean;
	item: AllergyDocument;
}

type StaticAllergyChipProps = ChipProps & AddedProps;

const StaticAllergyChip = React.forwardRef<any, StaticAllergyChipProps>(
	({loading = false, item, ...rest}, ref) => {
		let component: React.ElementType;
		let to: string;

		const clickable = Boolean(item && !rest.onDelete);

		if (clickable) {
			component = Link;
			to = `/allergy/${myEncodeURIComponent(item.name)}`;
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
