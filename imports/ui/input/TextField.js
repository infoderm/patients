import React from 'react';

import {makeStyles} from '@material-ui/core/styles';

import MuiTextField from '@material-ui/core/TextField';

const styles = () => ({
	readOnlyInput: {
		'&::before': {
			border: '0 !important'
		},
		'&::after': {
			border: '0 !important'
		}
	}
});

const useStyles = makeStyles(styles);

const TextField = (props) => {
	const classes = useStyles();

	const {readOnly, InputProps, ...rest} = props;

	const patchedInputProps = readOnly
		? {readOnly: true, className: classes.readOnlyInput, ...InputProps}
		: InputProps;

	return <MuiTextField InputProps={patchedInputProps} {...rest} />;
};

export default TextField;
