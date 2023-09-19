import React from 'react';

import MuiTextField, {
	type TextFieldProps as MuiTextFieldProps,
} from '@mui/material/TextField';

import makeStyles from '../styles/makeStyles';

const useStyles = makeStyles()({
	readOnlyInput: {
		'&::before': {
			border: '0 !important',
		},
		'&::after': {
			border: '0 !important',
		},
	},
});

type AddedProps = {
	readonly readOnly?: boolean;
};

type Props = MuiTextFieldProps & AddedProps;

const TextField = React.forwardRef<any, Props>((props, ref) => {
	const {classes} = useStyles();

	const {readOnly, InputProps, inputProps, ...rest} = props;

	const patchedInputProps = readOnly
		? {readOnly: true, className: classes.readOnlyInput, ...InputProps}
		: InputProps;

	const patchedInputInputProps = readOnly
		? {'aria-readonly': true, ...inputProps}
		: inputProps;

	return (
		<MuiTextField
			ref={ref}
			InputProps={patchedInputProps}
			inputProps={patchedInputInputProps}
			{...rest}
		/>
	);
});

export default TextField;
