import React, {type ChangeEvent} from 'react';

import {type GridFilterInputBooleanProps} from '@mui/x-data-grid';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/NativeSelect';

import useUniqueId from '../../hooks/useUniqueId';

export const GridFilterBooleanInput = ({
	item,
	applyValue,
	apiRef,
}: GridFilterInputBooleanProps) => {
	const handleFilterChange = ({
		target: {value},
	}: ChangeEvent<HTMLSelectElement>) => {
		applyValue({
			...item,
			value: _valueForOption(value as 'any' | 'true' | 'false'),
		});
	};

	const id = useUniqueId('grid-filter-boolean-input-select');
	const label = apiRef.current.getLocaleText('filterPanelInputLabel');

	return (
		<FormControl fullWidth>
			<InputLabel htmlFor={id}>{label}</InputLabel>
			<Select
				autoFocus
				value={item.value ?? 'any'}
				inputProps={{
					id,
				}}
				onChange={handleFilterChange}
			>
				<option value="any">
					{apiRef.current.getLocaleText('filterValueAny')}
				</option>
				<option value="true">
					{apiRef.current.getLocaleText('filterValueTrue')}
				</option>
				<option value="false">
					{apiRef.current.getLocaleText('filterValueFalse')}
				</option>
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
