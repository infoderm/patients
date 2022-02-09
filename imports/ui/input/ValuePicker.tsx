import React from 'react';

import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import useUniqueId from '../hooks/useUniqueId';

interface Props {
	options: string[];
	optionToString?: (option: string) => string;
	pairToKey?: (option: string, index: number) => React.Key;

	// Select
	readOnly?: boolean;
	label?: React.ReactNode;
	value?: any;
	onChange?: (e: any) => void;

	// input
	name?: string;
}

const ValuePicker = ({
	label,
	name,
	value,
	onChange,
	options,
	optionToString = (x) => x.toString(),
	pairToKey = (option, _index) => option,
	...rest
}: Props) => {
	const inputId = useUniqueId('value-picker-select');

	const input = <Input id={inputId} />;

	const inputProps = {
		name,
		id: inputId,
	};

	return (
		<FormControl>
			{label && <InputLabel htmlFor={inputId}>{label}</InputLabel>}
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

export default ValuePicker;
