import React, {useCallback, useMemo, type ChangeEvent} from 'react';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import {type UserSettings, type SettingKey} from '../../api/settings';

import {useSettingDebounced} from './hooks';

type Outcome = {
	outcome: -1 | 0 | 1;
	//  1 valid input (sync)
	// -1 intermediate input (no sync, update, error/warning? label)
	//  0 wrong input (no sync, no update)
};

type StringSettingKey = keyof {
	[K in SettingKey]: string extends UserSettings[K] ? 1 : never;
};

type Props<K extends StringSettingKey> = {
	readonly className?: string;
	readonly title?: string;
	readonly label?: string;
	readonly setting: K;
	readonly sanitize?: (inputValue: string) => any;
	readonly validate?: (x: string) => Outcome;
};

const InputOneSetting = <K extends StringSettingKey>({
	className,
	setting,
	sanitize = (x) => x,
	validate = () => ({outcome: 1}),
	label,
	title,
}: Props<K>) => {
	const {loading, value, setValue} = useSettingDebounced<K>(setting);

	const error = useMemo(
		() => !validate(value as string).outcome,
		[validate, value],
	);

	const onChange = useCallback(
		async ({
			target: {value},
		}: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
			setValue(sanitize(value)),
		[setValue, sanitize],
	);

	return (
		<div className={className}>
			{title && <Typography variant="h4">{title}</Typography>}
			<TextField
				disabled={loading}
				label={label}
				value={value}
				error={error}
				onChange={onChange}
			/>
		</div>
	);
};

export default InputOneSetting;
