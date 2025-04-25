import React, {useCallback} from 'react';

import {type GridFilterInputValueProps} from '@mui/x-data-grid';

import {DateTimePicker} from '@mui/x-date-pickers';

export const GridFilterDateTimeInput = ({
	item,
	applyValue,
	apiRef,
}: GridFilterInputValueProps) => {
	const handleFilterChange = useCallback(
		(newValue: unknown) => {
			applyValue({...item, value: newValue});
		},
		[applyValue],
	);

	return (
		<DateTimePicker
			autoFocus
			value={item.value || null}
			label={apiRef.current.getLocaleText('filterPanelInputLabel')}
			slotProps={{
				textField: {
					variant: 'standard',
				},
				inputAdornment: {
					sx: {
						'& .MuiButtonBase-root': {
							marginRight: -1,
						},
					},
				},
			}}
			onChange={handleFilterChange}
		/>
	);
};
