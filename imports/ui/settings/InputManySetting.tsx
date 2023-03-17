import React, {useMemo} from 'react';

import Typography from '@mui/material/Typography';
import SetPicker from '../input/SetPicker';

import type PropsOf from '../../lib/types/PropsOf';
import {type SettingKey, type UserSettings} from '../../api/settings';
import {useSetting} from './hooks';

type BaseProps<K extends SettingKey> = UserSettings[K] extends Array<infer V>
	? {
			className?: string;
			setting: K;
			makeSuggestions?: (
				value: UserSettings[K],
			) => (x: string) => {loading?: boolean; results: UserSettings[K]};
			title: string;
			label?: string;
			placeholder?: string;
			itemToKey?: (x: V) => string;
			itemToString?: (x: V) => string;
			sort?: (items: UserSettings[K]) => UserSettings[K];
	  }
	: never;

export type InputManySettingProps<K extends SettingKey> = BaseProps<K> &
	Omit<
		PropsOf<typeof SetPicker>,
		'onChange' | 'value' | 'useSuggestions' | 'itemToKey' | 'itemToString'
	>;

const identity = <T,>(x: T) => x;

const InputManySetting = <K extends SettingKey>({
	className = undefined,
	setting,
	makeSuggestions = () => () => ({results: [] as unknown as UserSettings[K]}),
	label = undefined,
	placeholder = undefined,
	title,
	sort = undefined,
	...rest
}: InputManySettingProps<K>) => {
	const {loading, value, setValue} = useSetting(setting);

	const onChange = useMemo(
		() => async (e) => {
			const newValue = e.target.value;
			await setValue(sort ? sort(newValue) : newValue);
		},
		[setValue, sort],
	);

	const sortedValue = useMemo(
		() => (sort ? sort(value) : value),
		[value, sort],
	);

	return (
		<div className={className}>
			<Typography variant="h4">{title}</Typography>
			<SetPicker
				readOnly={loading}
				useSuggestions={makeSuggestions(value)}
				itemToKey={identity}
				itemToString={identity}
				createNewItem={identity}
				TextFieldProps={{
					label,
					margin: 'normal',
				}}
				value={sortedValue as unknown[]}
				placeholder={loading ? 'loading...' : placeholder}
				onChange={onChange}
				{...rest}
			/>
		</div>
	);
};

export default InputManySetting;
