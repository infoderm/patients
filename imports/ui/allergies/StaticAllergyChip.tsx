import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import {darken} from '@material-ui/core/styles/colorManipulator';
import classNames from 'classnames';

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

const styles = {
	chip: ({loading, color, clickable}) => {
		const backgroundColor = loading ? '#999' : color;
		const computedColor = loading
			? '#eee'
			: color
			? colord(color).isLight()
				? '#111'
				: '#ddd'
			: undefined;
		const cursor = clickable ? 'pointer' : undefined;
		return {
			backgroundColor,
			color: computedColor,
			cursor,
			'&:hover, &:focus': {
				backgroundColor: backgroundColor && darken(backgroundColor, 0.1)
			}
		};
	}
};

const useStyles = makeStyles(styles);

const StaticAllergyChip = React.forwardRef<any, StaticAllergyChipProps>(
	({loading = false, item, className, ...rest}, ref) => {
		let component: React.ElementType;
		let to: string;

		const clickable = Boolean(item && !rest.onDelete);
		const classes = useStyles({loading, color: item?.color, clickable});

		if (clickable) {
			component = Link;
			to = `/allergy/${myEncodeURIComponent(item.name)}`;
		}

		return (
			<Chip
				ref={ref}
				className={classNames(classes.chip, className)}
				{...rest}
				component={component}
				to={to}
			/>
		);
	}
);

export default StaticAllergyChip;
