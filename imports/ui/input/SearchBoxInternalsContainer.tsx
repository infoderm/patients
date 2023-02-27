import React from 'react';

import {styled} from '@mui/material/styles';

const Root = styled('div')(({theme}) => ({
	display: 'block',
	position: 'relative',
	marginLeft: theme.spacing(1),
	marginRight: theme.spacing(2),
}));

type Props = {
	className?: string;
	children: any;
};

export default function SearchBoxInternalsContainer({
	className,
	children,
}: Props) {
	return <Root className={className}>{children}</Root>;
}
