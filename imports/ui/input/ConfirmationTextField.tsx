import React, {useState} from 'react';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import AssignmentIcon from '@mui/icons-material/Assignment';

import useAny from '../hooks/useAny';
import type PropsOf from '../../lib/types/PropsOf';

export const useConfirmationTextFieldState = (
	expected: string,
	getError: (expected: string, newValue: string) => string,
	initValue = '',
	initError = '',
) => {
	const [value, setValue] = useState(initValue);
	const [error, setError] = useState(initError);
	const erroredOnce = useAny(error);

	const checkAndUpdate = (newValue: string) => {
		const error = getError(expected, newValue);
		setError(error);
		return !error;
	};

	const validate = () => checkAndUpdate(value);

	const checkAndUpdateOnlyIfErroredOnce = (value: string) =>
		erroredOnce && checkAndUpdate(value);

	const onAutoFill = () => {
		setValue(expected);
		setError('');
	};

	const onChange = (event) => {
		setValue(event.target.value);
		checkAndUpdateOnlyIfErroredOnce(event.target.value);
	};

	return {
		value,
		setValue,
		error,
		setError,
		erroredOnce,
		validate,
		onAutoFill,
		onChange,
		props: {
			value,
			error: Boolean(error),
			helperText: error,
			onAutoFill,
			onChange,
		},
	};
};

type ConfirmationTextFieldAdditionalProps = {
	readonly onAutoFill: () => void;
};

const ConfirmationTextField = ({
	onAutoFill,
	...rest
}: ConfirmationTextFieldAdditionalProps & PropsOf<typeof TextField>) => (
	<TextField
		InputProps={{
			endAdornment: (
				<InputAdornment position="end">
					<IconButton
						size="large"
						aria-label="autofill"
						onClick={onAutoFill}
						onMouseDown={(e) => {
							e.preventDefault();
						}}
					>
						<AssignmentIcon />
					</IconButton>
				</InputAdornment>
			),
		}}
		{...rest}
	/>
);

export default ConfirmationTextField;
