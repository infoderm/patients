import React from 'react';

import FormControl from '@mui/material/FormControl';
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
	const id = useUniqueId('value-picker');
	const selectId = `${id}-select`;
	const labelId = `${id}-label`;

	return (
		<FormControl>
			{label && <InputLabel id={labelId}>{label}</InputLabel>}
			<Select
				labelId={labelId}
				id={selectId}
				value={value}
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
