import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

const useStyles = makeStyles({
	inputContainer: {
		display: 'flex',
		alignItems: 'center',
		borderRadius: 2
	}
});

type Props = {
	className?: string;
	children: any;
};

export default function SearchBoxInternalsInputContainer({
	className,
	children
}: Props) {
	const classes = useStyles();
	return (
		<div className={classNames(classes.inputContainer, className)}>
			{children}
		</div>
	);
}
