import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

const useStyles = makeStyles({
	inputContainer: {
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
		const classes = useStyles();
		return (
			<div ref={ref} className={classNames(classes.inputContainer, className)}>
				{children}
			</div>
		);
	},
);

export default SearchBoxInternalsInputContainer;
