import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

import ColorLensIcon from '@material-ui/icons/ColorLens';

import {colord} from 'colord';
import {DEFAULT_CONVERTER, converters} from '../transformers';
import PickerDialog from './PickerDialog';

const ColorPicker = ({
	// ColorPicker
	defaultValue,
	onChange,
	convert,

	// Text field
	// name,
	// id,
	// hintText,
	// placeholder,
	// floatingLabelText,
	// label,
	// TextFieldProps,
}) => {
	const [showPicker, setShowPicker] = useState(false);
	const [value, setValue] = useState(defaultValue);

	useEffect(() => {
		if (defaultValue !== value) setValue(defaultValue);
	}, [defaultValue]);

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
				onClick={() => setShowPicker(true)}
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

ColorPicker.propTypes = {
	defaultValue: PropTypes.string,
	onChange: PropTypes.func,
	convert: PropTypes.oneOf(Object.keys(converters)),
};

ColorPicker.defaultProps = {
	convert: DEFAULT_CONVERTER,
};

export default ColorPicker;
