import React from 'react';

import Typography from '@mui/material/Typography';

import debounce from 'debounce';

import ColorPicker from '../input/ColorPicker';
import {type SettingKey, type UserSettings} from '../../api/settings';
import {useSetting} from './hooks';
import SettingResetButton from './SettingResetButton';

type Props<K extends SettingKey> = UserSettings[K] extends string
	? {
			className?: string;
			title?: string;
			setting: K;
	  }
	: never;

const SelectColorSetting = <K extends SettingKey>({
	className,
	setting,
	title,
}: Props<K>) => {
	const {loading, value, setValue} = useSetting(setting);

	const onChange = async (newValue: string) => {
		await setValue(newValue as UserSettings[K]);
	};

	return (
		<div className={className}>
			{title && <Typography variant="h4">{title}</Typography>}
			<ColorPicker
				readOnly={loading}
				defaultValue={value as string}
				onChange={debounce(onChange, 1000)}
			/>
			<SettingResetButton setting={setting} />
		</div>
	);
};

export default SelectColorSetting;
