import React from 'react';
import PropTypes from 'prop-types';

import makeStyles from '@mui/styles/makeStyles';
import classNames from 'classnames';

import InputBase from '@mui/material/InputBase';

const useStyles = makeStyles((theme) => ({
	Input: {
		display: 'inline-flex',
		flexGrow: 1,
		color: 'inherit',
	},
	inputInput: {
		paddingTop: theme.spacing(1),
		paddingRight: theme.spacing(1),
		paddingBottom: theme.spacing(1),
		color: 'inherit',
	},
	dynamic: {
		transition: theme.transitions.create('width'),
		[theme.breakpoints.up('sm')]: {
			width: 220,
			'&:focus': {
				width: 320,
			},
		},
	},
}));

export default function SearchBoxInternalsInput(props) {
	const {className, expands, 'aria-label': ariaLabel, ...rest} = props;

	const classes = useStyles();

	return (
		<InputBase
			className={classNames(className, classes.Input)}
			type="search"
			inputProps={{
				'aria-label': ariaLabel,
				className: classNames(classes.inputInput, {
					[classes.dynamic]: expands,
				}),
			}}
			{...rest}
		/>
	);
}

SearchBoxInternalsInput.defaultProps = {
	expands: false,
};

SearchBoxInternalsInput.propTypes = {
	expands: PropTypes.bool,
};
