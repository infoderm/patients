import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import InputBase from '@material-ui/core/InputBase';

const useStyles = makeStyles((theme) => ({
	inputInput: {
		paddingTop: theme.spacing(1),
		paddingRight: theme.spacing(1),
		paddingBottom: theme.spacing(1),
		transition: theme.transitions.create('width'),
		width: '100%',
		color: 'white',
		[theme.breakpoints.up('sm')]: {
			width: 220,
			'&:focus': {
				width: 320
			}
		}
	}
}));

export default function SearchBoxInternalsInput(props) {
	const {ref, placeholder, inputProps, ...rest} = props;

	const classes = useStyles();

	return (
		<InputBase
			{...rest}
			inputRef={ref}
			inputProps={{
				className: classes.inputInput,
				classes: {
					input: classes.inputInput
				},
				placeholder,
				...inputProps
			}}
		/>
	);
}

SearchBoxInternalsInput.propTypes = {
	inputProps: PropTypes.object.isRequired,
	placeholder: PropTypes.string
};
