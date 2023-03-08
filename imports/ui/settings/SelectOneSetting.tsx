import React from 'react';

import Typography from '@mui/material/Typography';

import {type SelectChangeEvent} from '@mui/material';
import ValuePicker from '../input/ValuePicker';

import {useSetting} from './hooks';

type Props<T> = {
	className?: string;
	title?: string;
	label?: string;
	setting: string;
	options: T[];
	optionToString?: (option: T) => string;
};

const SelectOneSetting = <T extends {}>({
	className,
	setting,
	options,
	optionToString,
	label,
	title,
}: Props<T>) => {
	const {loading, value, setValue} = useSetting(setting);

	const onChange = async (e: SelectChangeEvent<T>) => {
		const newValue = e.target.value;
		await setValue(newValue);
	};

	return (
		<div className={className}>
			{title && <Typography variant="h4">{title}</Typography>}
			<ValuePicker
				readOnly={loading}
				options={options}
				optionToString={optionToString}
				label={label}
				value={value}
				onChange={onChange}
			/>
		</div>
	);
};

export default SelectOneSetting;
