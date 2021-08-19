import React from 'react';

import PropTypes, {InferProps} from 'prop-types';

import Prev from './Prev';
import Next from './Next';

const PaginatorPropTypes = {
	root: PropTypes.string.isRequired,
	page: PropTypes.number.isRequired,
	end: PropTypes.bool,
	disabled: PropTypes.bool,
};

type Props = InferProps<typeof PaginatorPropTypes>;

const Paginator = ({root, page, end = false, disabled = false}: Props) => {
	if (page === 1 && end) {
		return null;
	}

	return (
		<>
			<Prev to={`${root}/page/${page - 1}`} disabled={disabled || page === 1} />
			<Next to={`${root}/page/${page + 1}`} disabled={disabled || end} />
		</>
	);
};

Paginator.propTypes = PaginatorPropTypes;

export default Paginator;
