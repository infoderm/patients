import React from 'react';

import PropTypes from 'prop-types';

import Prev from './Prev';
import Next from './Next';

export default function Paginator({root, page, end, disabled}) {
	if (page === 1 && end) {
		return null;
	}

	return (
		<>
			<Prev to={`${root}/page/${page - 1}`} disabled={disabled || page === 1} />
			<Next to={`${root}/page/${page + 1}`} disabled={disabled || end} />
		</>
	);
}

Paginator.defaultProps = {
	end: false,
	disabled: false,
};

Paginator.propTypes = {
	page: PropTypes.number.isRequired,
	end: PropTypes.bool,
	disabled: PropTypes.bool,
	root: PropTypes.string.isRequired,
};
