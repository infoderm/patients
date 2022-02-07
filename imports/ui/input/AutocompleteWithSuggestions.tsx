import React from 'react';
import PropTypes from 'prop-types';

import Autocomplete from '@mui/lab/Autocomplete';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import CircularProgress from '@mui/material/CircularProgress';

import PropsOf from '../../util/PropsOf';

interface BaseProps {
	itemToString: (x: any) => any;
	useSuggestions: (x: string) => {loading: boolean; results: any[]};
	inputValue: string;
	TextFieldProps?: any;
	InputProps?: any;
}

type Props = BaseProps &
	Omit<PropsOf<typeof Autocomplete>, 'renderInput' | 'options'>;

const AutocompleteWithSuggestions = ({
	itemToString,
	useSuggestions,
	TextFieldProps,
	InputProps,
	inputValue,
	...rest
}: Props) => {
	const {loading, results: items} = useSuggestions(inputValue);

	return (
		<Autocomplete
			freeSolo
			inputValue={inputValue}
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
						),
					}}
				/>
			)}
			getOptionLabel={(option) =>
				typeof option === 'string' ? option : itemToString(option)
			}
			getOptionDisabled={() => loading}
			{...rest}
		/>
	);
};

AutocompleteWithSuggestions.defaultProps = {
	itemToString: (x: any): any => x,
};

AutocompleteWithSuggestions.propTypes = {
	itemToString: PropTypes.func,
};

export default AutocompleteWithSuggestions;
