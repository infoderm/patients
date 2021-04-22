import React from 'react';
import PropTypes from 'prop-types';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import CircularProgress from '@material-ui/core/CircularProgress';

const AutocompleteWithSuggestions = ({
	itemToString,
	useSuggestions,
	TextFieldProps,
	InputProps,
	inputValue,
	onInputChange,
	value,
	onChange
}) => {
	const {loading, results: items} = useSuggestions(inputValue);

	return (
		<Autocomplete
			freeSolo
			inputValue={inputValue}
			value={value}
			options={items}
			filterOptions={(x) => x}
			renderInput={(params) => (
				<TextField
					{...params}
					{...TextFieldProps}
					InputProps={{
						...params.InputProps,
						...TextFieldProps?.InputProps,
						...InputProps,
						endAdornment: (
							<InputAdornment position="end">
								{loading ? (
									<CircularProgress color="inherit" size={20} />
								) : null}
								{InputProps?.endAdornment}
								{TextFieldProps?.InputProps?.endAdornment}
								{params.InputProps.endAdornment}
							</InputAdornment>
						)
					}}
				/>
			)}
			getOptionLabel={(option) =>
				typeof option === 'string' ? option : itemToString(option)
			}
			getOptionDisabled={() => loading}
			onInputChange={onInputChange}
			onChange={onChange}
		/>
	);
};

AutocompleteWithSuggestions.defaultProps = {
	itemToString: (x) => x
};

AutocompleteWithSuggestions.propTypes = {
	itemToString: PropTypes.func
};

export default AutocompleteWithSuggestions;
