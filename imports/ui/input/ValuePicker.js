import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const MAGIC = '8204932840';
let nextId = 0;

const ValuePicker = (props) => {
	const {
		label,
		name,
		value,
		onChange,
		options,
		optionToString,
		pairToKey,
		...rest
	} = props;

	let {id} = props;

	if (id === undefined && label) {
		id = `value-picker-${MAGIC}-${nextId++}`;
	}

	const input = <Input id={id} />;

	const inputProps = {
		name,
		id,
	};

	return (
		<FormControl>
			{label && <InputLabel htmlFor={id}>{label}</InputLabel>}
			<Select
				value={value}
				input={input}
				inputProps={inputProps}
				onChange={onChange}
				{...rest}
			>
				{options.map((option, index) => (
					<MenuItem key={pairToKey(option, index)} value={option}>
						{optionToString(option)}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

ValuePicker.defaultProps = {
	optionToString: (x) => x.toString(),
	pairToKey: (option, _index) => option,
};

ValuePicker.propTypes = {
	options: PropTypes.array.isRequired,
	optionToString: PropTypes.func,
	pairToKey: PropTypes.func,

	// Select
	readOnly: PropTypes.bool,
	label: PropTypes.node,
	value: PropTypes.any,
	onChange: PropTypes.func,
};

export default ValuePicker;
