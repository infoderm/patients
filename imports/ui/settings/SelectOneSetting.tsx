import React from 'react';

import Typography from '@mui/material/Typography';

import ValuePicker from '../input/ValuePicker';

import {useSetting} from './hooks';

type Props = {
	className?: string;
	title?: string;
	label?: string;
	setting: string;
	options: string[];
	optionToString?: (option: string) => string;
};

const SelectOneSetting = ({
	className,
	setting,
	options,
	optionToString,
	label,
	title,
}: Props) => {
	const {loading, value, setValue} = useSetting(setting);

	const onChange = async (e) => {
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
