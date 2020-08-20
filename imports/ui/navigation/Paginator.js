import React from 'react';

import PropTypes from 'prop-types';

import Prev from './Prev.js';
import Next from './Next.js';

export default function Paginator({root, page, end}) {
	if (page === 1 && end) {
		return null;
	}

	return (
		<>
			<Prev to={`${root}/page/${page - 1}`} disabled={page === 1} />
			<Next to={`${root}/page/${page + 1}`} disabled={end} />
		</>
	);
}

Paginator.defaultProps = {
	end: false
};

Paginator.propTypes = {
	page: PropTypes.number.isRequired,
	end: PropTypes.bool,
	root: PropTypes.string.isRequired
};
