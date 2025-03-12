import React, {useState, useEffect} from 'react';

import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';

import ColorLensIcon from '@mui/icons-material/ColorLens';

import color from '../../../../util/color';

import useChanged from '../../../hooks/useChanged';

import {DEFAULT_CONVERTER, converters} from '../transformers';

import PickerDialog from './PickerDialog';

type Props = {
	readonly 'aria-label'?: string;
	readonly defaultValue: string;
	readonly onChange: (color: string) => void;
	readonly convert?: keyof typeof converters;
	readonly readOnly?: boolean;
};

const ColorPicker = ({
	'aria-label': ariaLabel,
	defaultValue,
	onChange,
	convert = DEFAULT_CONVERTER,
	readOnly = false,
}: Props) => {
	const [showPicker, setShowPicker] = useState(false);
	const [value, setValue] = useState(defaultValue);
	const changed = useChanged([defaultValue]);

	useEffect(() => {
		if (changed) {
			setValue(defaultValue);
		}
	}, [changed, defaultValue]);

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
					color: color(value).isLight() ? '#111' : '#ddd',
				}}
				label={value}
				aria-label={ariaLabel}
				onClick={
					readOnly
						? undefined
						: () => {
								setShowPicker(true);
						  }
				}
			/>
			{!readOnly && showPicker && (
				<PickerDialog
					value={value}
					onClose={() => {
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
