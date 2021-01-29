import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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
		id
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
	pairToKey: (option, _index) => option
};

ValuePicker.propTypes = {
	options: PropTypes.array.isRequired,
	optionToString: PropTypes.func,
	pairToKey: PropTypes.func
};

export default ValuePicker;
