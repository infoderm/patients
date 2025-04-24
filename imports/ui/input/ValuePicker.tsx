import React, {type ReactNode} from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, {type SelectChangeEvent} from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import useUniqueId from '../hooks/useUniqueId';

type Props<T> = {
	readonly options: T[];
	readonly optionToString?: (option: T) => string;
	readonly pairToKey?: (option: T, index: number) => React.Key;

	// Select
	readonly readOnly?: boolean;
	readonly label?: ReactNode;
	readonly value?: T;
	readonly onChange?: (e: SelectChangeEvent<T>) => void;

	// input
	readonly name?: string;
};

const ValuePicker = <T,>({
	label,
	name,
	value,
	onChange,
	options,
	optionToString = (x) => `${x}`,
	pairToKey = (option, _index) => `${option}`,
	...rest
}: Props<T>) => {
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
				renderValue={optionToString}
				onChange={onChange}
				{...rest}
			>
				{options.map((option, index) => (
					// @ts-expect-error Types are wrong.
					<MenuItem key={pairToKey(option, index)} value={option}>
						{optionToString(option)}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default ValuePicker;
