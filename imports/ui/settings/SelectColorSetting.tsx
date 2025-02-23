import React from 'react';

import Typography from '@mui/material/Typography';

import ColorPicker from '../input/ColorPicker';
import {type SettingKey, type UserSettings} from '../../api/settings';

import {useSettingDebounced} from './hooks';
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
	const {loading, value, setValue, resetValue} = useSettingDebounced(setting);
	const onChange = setValue as (newValue: string) => Promise<void>;

	return (
		<div className={className}>
			{title && <Typography variant="h4">{title}</Typography>}
			<ColorPicker
				readOnly={loading}
				defaultValue={value as string}
				onChange={onChange}
			/>
			<SettingResetButton loading={loading} resetValue={resetValue} />
		</div>
	);
};

export default SelectColorSetting;
