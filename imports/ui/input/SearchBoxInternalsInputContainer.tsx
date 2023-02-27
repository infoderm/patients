import React from 'react';

import {styled} from '@mui/material/styles';

const Root = styled('div')({
	display: 'flex',
	alignItems: 'center',
	borderRadius: 2,
});

type Props = {
	className?: string;
	children: any;
};

const SearchBoxInternalsInputContainer = React.forwardRef<any, Props>(
	({className, children}, ref) => {
		return (
			<Root ref={ref} className={className}>
				{children}
			</Root>
		);
	},
);

export default SearchBoxInternalsInputContainer;
