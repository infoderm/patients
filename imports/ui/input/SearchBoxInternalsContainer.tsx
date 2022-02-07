import React from 'react';

import makeStyles from '@mui/styles/makeStyles';
import classNames from 'classnames';

const useStyles = makeStyles((theme) => ({
	container: {
		display: 'block',
		position: 'relative',
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(2),
	},
}));

type Props = {
	className?: string;
	children: any;
};

export default function SearchBoxInternalsContainer({
	className,
	children,
}: Props) {
	const classes = useStyles();
	return (
		<div className={classNames(classes.container, className)}>{children}</div>
	);
}
