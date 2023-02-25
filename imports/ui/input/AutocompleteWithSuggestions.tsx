import React from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import CircularProgress from '@mui/material/CircularProgress';

import type PropsOf from '../../lib/types/PropsOf';

type BaseProps = {
	itemToString?: (x: any) => any;
	useSuggestions: (x: string) => {loading: boolean; results: any[]};
	inputValue: string;
	TextFieldProps?: any;
	InputProps?: any;
};

type Props = BaseProps &
	Omit<PropsOf<typeof Autocomplete>, 'renderInput' | 'options'>;

const AutocompleteWithSuggestions = ({
	itemToString = (x: any): any => x,
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

export default AutocompleteWithSuggestions;
