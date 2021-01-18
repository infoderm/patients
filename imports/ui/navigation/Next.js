import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import FixedFab from '../button/FixedFab.js';

const Next = ({to, ...rest}) => (
	<FixedFab col={2} color="primary" component={Link} to={to} {...rest}>
		<NavigateNextIcon />
	</FixedFab>
);

Next.propTypes = {
	to: PropTypes.string.isRequired
};

export default Next;
