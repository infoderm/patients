import React, {useMemo} from 'react';

import Typography from '@mui/material/Typography';

import SetPicker from '../input/SetPicker';

import type PropsOf from '../../util/types/PropsOf';
import {type SettingKey, type UserSettings} from '../../api/settings';

import {useSettingDebounced} from './hooks';

type ArraySettingKey = {
	[K in SettingKey]: UserSettings[K] extends unknown[] ? K : never;
}[SettingKey];

type BaseProps<K extends ArraySettingKey> = UserSettings[K] extends Array<
	infer V
>
	? {
			className?: string;
			setting: K;
			makeSuggestions?: (
				value: UserSettings[K],
			) => (x: string) => {loading?: boolean; results: UserSettings[K]};
			title?: string;
			label?: string;
			placeholder?: string;
			itemToKey?: (x: V) => string;
			itemToString?: (x: V) => string;
			sort?: (items: UserSettings[K]) => UserSettings[K];
	  }
	: never;

export type InputManySettingProps<K extends ArraySettingKey> = BaseProps<K> &
	Omit<
		PropsOf<typeof SetPicker>,
		'onChange' | 'value' | 'useSuggestions' | 'itemToKey' | 'itemToString'
	>;

const identity = <T,>(x: T) => x;

const InputManySetting = <K extends ArraySettingKey>({
	className = undefined,
	setting,
	makeSuggestions = () => () => ({results: [] as unknown as UserSettings[K]}),
	label = undefined,
	placeholder = undefined,
	title,
	sort = undefined,
	...rest
}: InputManySettingProps<K>) => {
	const {loading, value, setValue} = useSettingDebounced<K>(setting);

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
			{title && <Typography variant="h4">{title}</Typography>}
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
