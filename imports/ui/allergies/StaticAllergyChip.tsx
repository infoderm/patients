import React from 'react';

import {Link} from 'react-router-dom';

import Chip, {ChipProps} from '@material-ui/core/Chip';

import {colord} from 'colord';

import {myEncodeURIComponent} from '../../client/uri';

import {AllergyDocument} from '../../api/allergies';

interface AddedProps {
	loading?: boolean;
	item: AllergyDocument;
}

type StaticAllergyChipProps = ChipProps & AddedProps;

const StaticAllergyChip = React.forwardRef<any, StaticAllergyChipProps>(
	({loading = false, item, ...rest}, ref) => {
		const style: React.CSSProperties = {};
		let component: React.ElementType;
		let to: string;

		if (loading) {
			style.backgroundColor = '#999';
			style.color = '#eee';
		}

		if (item) {
			if (item.color) {
				style.backgroundColor = item.color;
				style.color = colord(item.color).isLight() ? '#111' : '#ddd';
			}

			if (!rest.onDelete) {
				component = Link;
				to = `/allergy/${myEncodeURIComponent(item.name)}`;
				style.cursor = 'pointer';
			}
		}

		return (
			<Chip ref={ref} {...rest} style={style} component={component} to={to} />
		);
	}
);

export default StaticAllergyChip;
