import React, {useState} from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import AssignmentIcon from '@material-ui/icons/Assignment';

import useAny from '../hooks/useAny.js';

export const useConfirmationTextFieldState = (
	expected,
	getError,
	initValue = '',
	initError = ''
) => {
	const [value, setValue] = useState(initValue);
	const [error, setError] = useState(initError);
	const erroredOnce = useAny(error);

	const checkAndUpdate = (newValue) => {
		const error = getError(expected, newValue);
		setError(error);
		return !error;
	};

	const validate = () => checkAndUpdate(value);

	const checkAndUpdateOnlyIfErroredOnce = (value) =>
		erroredOnce && checkAndUpdate(value);

	const onAutoFill = () => {
		setValue(expected);
		setError('');
	};

	const onChange = (e) => {
		setValue(e.target.value);
		checkAndUpdateOnlyIfErroredOnce(e.target.value);
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
			onChange
		}
	};
};

const ConfirmationTextField = ({onAutoFill, ...rest}) => {
	return (
		<TextField
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<IconButton
							aria-label="autofill"
							onClick={onAutoFill}
							onMouseDown={(e) => e.preventDefault()}
						>
							<AssignmentIcon />
						</IconButton>
					</InputAdornment>
				)
			}}
			{...rest}
		/>
	);
};

ConfirmationTextField.propTypes = {
	onAutoFill: PropTypes.func.isRequired
};

export default ConfirmationTextField;
