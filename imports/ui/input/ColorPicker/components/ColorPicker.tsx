import React, {useState, useEffect} from 'react';

import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';

import ColorLensIcon from '@mui/icons-material/ColorLens';

import {colord} from 'colord';
import {DEFAULT_CONVERTER, converters} from '../transformers';
import PickerDialog from './PickerDialog';

interface Props {
	defaultValue: string;
	onChange: (color: string) => void;
	convert?: keyof typeof converters;
}

const ColorPicker = ({
	defaultValue,
	onChange,
	convert = DEFAULT_CONVERTER,
}: Props) => {
	const [showPicker, setShowPicker] = useState(false);
	const [value, setValue] = useState(defaultValue);
	const [previousDefaultValue, setPreviousDefaultValue] =
		useState(defaultValue);

	useEffect(() => {
		if (defaultValue !== previousDefaultValue) {
			setPreviousDefaultValue(defaultValue);
			setValue(defaultValue);
		}
	}, [defaultValue, previousDefaultValue]);

	return (
		<span>
			<Chip
				avatar={
					<Avatar>
						<ColorLensIcon />
					</Avatar>
				}
				style={{
					backgroundColor: value,
					color: colord(value).isLight() ? '#111' : '#ddd',
				}}
				label={value}
				onClick={() => {
					setShowPicker(true);
				}}
			/>
			{showPicker && (
				<PickerDialog
					value={value}
					onClick={() => {
						setShowPicker(false);
						onChange(value);
					}}
					onChange={(c) => {
						const newValue = converters[convert](c);
						setValue(newValue);
						onChange(newValue);
					}}
				/>
			)}
		</span>
	);
};

export default ColorPicker;
