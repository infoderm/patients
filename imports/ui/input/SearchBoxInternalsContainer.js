import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

const useStyles = makeStyles((theme) => ({
	container: {
		display: 'flex',
		alignItems: 'center',
		position: 'relative',
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(2),
		borderRadius: 2
	}
}));

export default function SearchBoxInternalsContainer({className, children}) {
	const classes = useStyles();
	return (
		<div className={classNames(className, classes.container)}>{children}</div>
	);
}
