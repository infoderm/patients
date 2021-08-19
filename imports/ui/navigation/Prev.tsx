import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import FixedFab from '../button/FixedFab';

const Prev = ({to, ...rest}) => (
	<FixedFab col={3} color="primary" component={Link} to={to} {...rest}>
		<NavigateBeforeIcon />
	</FixedFab>
);

Prev.propTypes = {
	to: PropTypes.string.isRequired,
};

export default Prev;
