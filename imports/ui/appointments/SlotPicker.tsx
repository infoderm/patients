import React from 'react';

import Grid from '@mui/material/Grid';

import isBefore from 'date-fns/isBefore';
import startOfToday from 'date-fns/startOfToday';

import {DatePicker, DesktopTimePicker as TimePicker} from '@mui/x-date-pickers';

import {type DateTimePickerState} from './useDateTimePickerState';

type SlotPickerProps = {
	readonly begin: DateTimePickerState;
	readonly end: DateTimePickerState;
};

export const SlotPicker = ({begin, end}: SlotPickerProps) => {
	const beginIsInThePast = isBefore(begin.datetime, startOfToday());
	const endIsAfterBegin = isBefore(end.datetime, begin.datetime);
	const displayBeginIsInThePast = beginIsInThePast;
	const displayEndIsAfterBegin = endIsAfterBegin;
	return (
		<>
			<Grid item xs={4}>
				<DatePicker
					value={begin.date}
					label="Date"
					slotProps={{
						textField: {
							InputLabelProps: {shrink: true},
							error: !begin.isValidDate || displayBeginIsInThePast,
							helperText: displayBeginIsInThePast
								? 'Date dans le passé!'
								: undefined,
						},
					}}
					onChange={(value: Date | null | undefined) => {
						begin.setDate(value);
						end.setDate(value);
					}}
				/>
			</Grid>
			<Grid item xs={4}>
				<TimePicker
					slotProps={{
						textField: {
							InputLabelProps: {shrink: true},
							error: !begin.isValidTime,
						},
					}}
					label="Begin"
					value={begin.time}
					onChange={begin.setTime}
				/>
			</Grid>
			<Grid item xs={4}>
				<TimePicker
					slotProps={{
						textField: {
							InputLabelProps: {shrink: true},
							error: !end.isValidDate || displayEndIsAfterBegin,
							helperText: displayEndIsAfterBegin
								? 'Fin avant le début!'
								: undefined,
						},
					}}
					label="End"
					value={end.time}
					onChange={end.setTime}
				/>
			</Grid>
		</>
	);
};
