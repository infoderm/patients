import React from 'react';
import PropTypes from 'prop-types';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import CircularProgress from '@material-ui/core/CircularProgress';

const AutocompleteWithSuggestions = ({
	itemToString,
	useSuggestions,
	TextFieldProps,
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
						endAdornment: (
							<>
								{loading ? (
									<CircularProgress color="inherit" size={20} />
								) : null}
								{params.InputProps.endAdornment}
							</>
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
