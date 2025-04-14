import React from 'react';

import {type GridFilterInputBooleanProps} from '@mui/x-data-grid';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, {type SelectChangeEvent} from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export const GridFilterBooleanInput = ({
	item,
	applyValue,
	apiRef,
}: GridFilterInputBooleanProps) => {
	const handleFilterChange = ({
		target: {value},
	}: SelectChangeEvent<'any' | 'true' | 'false'>) => {
		applyValue({
			...item,
			value: _valueForOption(value as 'any' | 'true' | 'false'),
		});
	};

	const label = apiRef.current.getLocaleText('filterPanelInputLabel');

	return (
		<FormControl fullWidth>
			<InputLabel>{label}</InputLabel>
			<Select
				autoFocus
				value={item.value ?? 'any'}
				label={label}
				onChange={handleFilterChange}
			>
				<MenuItem value="any">
					{apiRef.current.getLocaleText('filterValueAny')}
				</MenuItem>
				<MenuItem value="true">
					{apiRef.current.getLocaleText('filterValueTrue')}
				</MenuItem>
				<MenuItem value="false">
					{apiRef.current.getLocaleText('filterValueFalse')}
				</MenuItem>
			</Select>
		</FormControl>
	);
};

const _valueForOption = (option: 'any' | 'true' | 'false') => {
	// eslint-disable-next-line default-case
	switch (option) {
		case 'any': {
			return undefined;
		}

		case 'true': {
			return true;
		}

		case 'false': {
			return false;
		}
	}
};
