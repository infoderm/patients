import React from 'react';

import Typography from '@mui/material/Typography';

import ColorPicker from '../input/ColorPicker';
import {type SettingKey, type UserSettings} from '../../api/settings';

import {useSettingDebounced, withBrowserCache} from './hooks';
import SettingResetButton from './SettingResetButton';

type Props<K extends SettingKey> = UserSettings[K] extends string
	? {
			className?: string;
			title?: string;
			'aria-label'?: string;
			setting: K;
	  }
	: never;

const SelectColorSetting = <K extends SettingKey>({
	'aria-label': ariaLabel,
	className,
	setting,
	title,
}: Props<K>) => {
	const {loading, value, setValue, resetValue} = useSettingDebounced(
		setting,
		withBrowserCache,
	);
	const onChange = setValue as (newValue: string) => Promise<void>;

	return (
		<div className={className}>
			{title && <Typography variant="h4">{title}</Typography>}
			<ColorPicker
				aria-label={ariaLabel}
				readOnly={loading}
				defaultValue={value as string}
				onChange={onChange}
			/>
			<SettingResetButton
				aria-label={
					ariaLabel === undefined
						? undefined
						: `Reset ${ariaLabel.toLowerCase()}`
				}
				loading={loading}
				resetValue={resetValue}
			/>
		</div>
	);
};

export default SelectColorSetting;
