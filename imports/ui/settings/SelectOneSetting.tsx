import React from 'react';

import Typography from '@mui/material/Typography';

import {type SelectChangeEvent} from '@mui/material';
import ValuePicker from '../input/ValuePicker';

import {type SettingKey, type UserSettings} from '../../api/settings';
import {useSetting} from './hooks';

type Props<K extends SettingKey> = {
	className?: string;
	title?: string;
	label?: string;
	setting: K;
	options: Array<UserSettings[K]>;
	optionToString?: (option: UserSettings[K]) => string;
};

const SelectOneSetting = <K extends SettingKey>({
	className,
	setting,
	options,
	optionToString,
	label,
	title,
}: Props<K>) => {
	const {loading, value, setValue} = useSetting(setting);

	const onChange = async (e: SelectChangeEvent<UserSettings[K]>) => {
		const newValue = e.target.value as UserSettings[K];
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
