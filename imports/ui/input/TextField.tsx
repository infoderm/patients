import React from 'react';

import {makeStyles} from '@material-ui/core/styles';

import MuiTextField, {
	TextFieldProps as MuiTextFieldProps,
} from '@material-ui/core/TextField';

const styles = () => ({
	readOnlyInput: {
		'&::before': {
			border: '0 !important',
		},
		'&::after': {
			border: '0 !important',
		},
	},
});

const useStyles = makeStyles(styles);

interface AddedProps {
	readOnly?: boolean;
}

type Props = MuiTextFieldProps & AddedProps;

const TextField = React.forwardRef<any, Props>((props, ref) => {
	const classes = useStyles();

	const {readOnly, InputProps, ...rest} = props;

	const patchedInputProps = readOnly
		? {readOnly: true, className: classes.readOnlyInput, ...InputProps}
		: InputProps;

	return <MuiTextField ref={ref} InputProps={patchedInputProps} {...rest} />;
});

export default TextField;
