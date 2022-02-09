import React from 'react';

import Typography from '@mui/material/Typography';

import debounce from 'debounce';

import ColorPicker from '../input/ColorPicker';
import {useSetting} from './hooks';
import SettingResetButton from './SettingResetButton';

interface Props {
	className?: string;
	title?: string;
	setting: string;
}

const SelectColorSetting = ({className, setting, title}: Props) => {
	const {loading, value, setValue} = useSetting(setting);

	const onChange = async (newValue: string) => {
		await setValue(newValue);
	};

	return (
		<div className={className}>
			{title && <Typography variant="h4">{title}</Typography>}
			<ColorPicker
				readOnly={loading}
				defaultValue={value}
				onChange={debounce(onChange, 1000)}
			/>
			<SettingResetButton setting={setting} />
		</div>
	);
};

export default SelectColorSetting;
