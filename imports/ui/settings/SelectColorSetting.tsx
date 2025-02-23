import React, {useMemo} from 'react';

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
	const {loading, value, setValue, resetValue} = useSetting(setting);

	const onChange = useMemo(
		() =>
			debounce(async (newValue: string) => {
				await setValue(newValue as UserSettings[K]);
			}, 1000),
		[setValue],
	);

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
