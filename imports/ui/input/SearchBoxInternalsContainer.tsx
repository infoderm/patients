import React from 'react';

import {styled} from '@mui/material/styles';
import classNames from 'classnames';

const PREFIX = 'SearchBoxInternalsContainer';

const classes = {
	container: `${PREFIX}-container`,
};

const Root = styled('div')(({theme}) => ({
	[`&.${classes.container}`]: {
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
	return (
		<Root className={classNames(classes.container, className)}>{children}</Root>
	);
}
