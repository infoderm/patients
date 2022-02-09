import React from 'react';

import {styled} from '@mui/material/styles';
import classNames from 'classnames';

const PREFIX = 'SearchBoxInternalsInputContainer';

const classes = {
	inputContainer: `${PREFIX}-inputContainer`,
};

const Root = styled('div')({
	[`&.${classes.inputContainer}`]: {
		display: 'flex',
		alignItems: 'center',
		borderRadius: 2,
	},
});

type Props = {
	className?: string;
	children: any;
};

const SearchBoxInternalsInputContainer = React.forwardRef<any, Props>(
	({className, children}, ref) => {
		return (
			<Root ref={ref} className={classNames(classes.inputContainer, className)}>
				{children}
			</Root>
		);
	},
);

export default SearchBoxInternalsInputContainer;
