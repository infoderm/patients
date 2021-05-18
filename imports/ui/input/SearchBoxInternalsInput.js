import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

import InputBase from '@material-ui/core/InputBase';

const useStyles = makeStyles((theme) => ({
	Input: {
		display: 'inline-flex',
		flexGrow: 1,
		color: 'inherit'
	},
	inputInput: {
		paddingTop: theme.spacing(1),
		paddingRight: theme.spacing(1),
		paddingBottom: theme.spacing(1),
		color: 'inherit'
	},
	dynamic: {
		transition: theme.transitions.create('width'),
		[theme.breakpoints.up('sm')]: {
			width: 220,
			'&:focus': {
				width: 320
			}
		}
	}
}));

export default function SearchBoxInternalsInput(props) {
	const {ref, className, inputProps, expands, ...rest} = props;

	const classes = useStyles();

	return (
		<InputBase
			{...rest}
			className={classNames(className, classes.Input)}
			inputRef={ref}
			inputProps={{
				...inputProps,
				className: classNames(inputProps.className, classes.inputInput, {
					[classes.dynamic]: expands
				})
			}}
		/>
	);
}

SearchBoxInternalsInput.defaultProps = {
	expands: false
};

SearchBoxInternalsInput.propTypes = {
	inputProps: PropTypes.object.isRequired,
	expands: PropTypes.bool
};
