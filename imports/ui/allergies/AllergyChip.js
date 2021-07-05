import React from 'react';

import {Link} from 'react-router-dom';

import Chip from '@material-ui/core/Chip';

import {colord} from 'colord';

import {myEncodeURIComponent} from '../../client/uri';

import withAllergy from './withAllergy';

const AllergyChipWithoutItem = ({name, loading, item, ...rest}) => {
	const style = {};
	let component;
	let to;

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
		<Chip {...rest} label={name} style={style} component={component} to={to} />
	);
};

const AllergyChipWithItem = withAllergy(AllergyChipWithoutItem);

const AllergyChip = ({label, ...rest}) => (
	<AllergyChipWithItem name={label} {...rest} />
);

export default AllergyChip;
