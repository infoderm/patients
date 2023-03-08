import React, {type ReactNode} from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, {type SelectChangeEvent} from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import useUniqueId from '../hooks/useUniqueId';

type Props<T> = {
	options: T[];
	optionToString?: (option: T) => string;
	pairToKey?: (option: T, index: number) => React.Key;

	// Select
	readOnly?: boolean;
	label?: ReactNode;
	value?: T;
	onChange?: (e: SelectChangeEvent<T>) => void;

	// input
	name?: string;
};

const ValuePicker = <T extends {}>({
	label,
	name,
	value,
	onChange,
	options,
	// eslint-disable-next-line @typescript-eslint/no-base-to-string
	optionToString = (x) => x.toString(),
	// eslint-disable-next-line @typescript-eslint/no-base-to-string
	pairToKey = (option, _index) => option.toString(),
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
