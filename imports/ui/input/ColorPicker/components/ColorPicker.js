import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withState from 'recompose/withState';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

import ColorLensIcon from '@material-ui/icons/ColorLens';

import {DEFAULT_CONVERTER, converters} from '../transformers';
import PickerDialog from './PickerDialog';

import color from 'color';

const ColorPicker = ({
	// ColorPicker
	// defaultValue,
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

	// State
	showPicker,
	setShowPicker,
	value,
	setValue
}) => (
	<span>
		<Chip
			avatar={
				<Avatar>
					<ColorLensIcon />
				</Avatar>
			}
			style={{
				backgroundColor: value,
				color: color(value).isLight() ? '#111' : '#ddd'
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

ColorPicker.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
	convert: PropTypes.oneOf(Object.keys(converters))
};

ColorPicker.defaultProps = {
	convert: DEFAULT_CONVERTER
};

const makeColorPicker = compose(
	withState('showPicker', 'setShowPicker', false),
	withState('value', 'setValue', ({defaultValue}) => defaultValue)
);

export default makeColorPicker(ColorPicker);
