import React, {useMemo} from 'react';

import Typography from '@mui/material/Typography';
import SetPicker from '../input/SetPicker';

import type PropsOf from '../../lib/types/PropsOf';
import {useSetting} from './hooks';

type BaseProps = {
	className?: string;
	setting: string;
	makeSuggestions?: (
		value: any[],
	) => (x: string) => {loading?: boolean; results: any[]};
	title: string;
	label?: string;
	placeholder?: string;
	itemToKey?: (x: any) => any;
	itemToString?: (x: any) => any;
	sort?: (items: any[]) => any[];
};

type Props = BaseProps &
	Omit<
		PropsOf<typeof SetPicker>,
		'onChange' | 'value' | 'useSuggestions' | 'itemToKey' | 'itemToString'
	>;

const identity = (x) => x;

const InputManySetting = ({
	className = undefined,
	setting,
	makeSuggestions = () => () => ({results: []}),
	label = undefined,
	placeholder = undefined,
	title,
	sort = undefined,
	...rest
}: Props) => {
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
				value={sortedValue}
				placeholder={loading ? 'loading...' : placeholder}
				onChange={onChange}
				{...rest}
			/>
		</div>
	);
};

export default InputManySetting;
