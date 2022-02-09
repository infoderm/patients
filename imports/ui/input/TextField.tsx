import React from 'react';

import makeStyles from '@mui/styles/makeStyles';

import MuiTextField, {
	TextFieldProps as MuiTextFieldProps,
} from '@mui/material/TextField';

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
