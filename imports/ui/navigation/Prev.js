import React from 'react';

import {Link} from 'react-router-dom';

import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

const useStyles = makeStyles((theme) => ({
	fabprev: {
		position: 'fixed',
		bottom: theme.spacing(3),
		right: theme.spacing(21)
	}
}));

export default function Previous({to, ...rest}) {
	const classes = useStyles();

	return (
		<Fab
			className={classes.fabprev}
			color="primary"
			component={Link}
			to={to}
			{...rest}
		>
			<NavigateBeforeIcon />
		</Fab>
	);
}

Previous.propTypes = {
	to: PropTypes.string.isRequired
};
