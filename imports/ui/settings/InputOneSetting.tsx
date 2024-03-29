import React, {useState, useEffect} from 'react';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import {type SettingKey} from '../../api/settings';

import {useSetting} from './hooks';

type Outcome = {
	outcome: -1 | 0 | 1;
	//  1 valid input (sync)
	// -1 intermediate input (no sync, update, error/warning? label)
	//  0 wrong input (no sync, no update)
};

type Props<K extends SettingKey> = {
	readonly className?: string;
	readonly title?: string;
	readonly label?: string;
	readonly setting: K;
	readonly sanitize?: (inputValue: string) => any;
	readonly validate?: (x: any) => Outcome;
};

const InputOneSetting = <K extends SettingKey>({
	className,
	setting,
	sanitize = (x) => x,
	validate = () => ({outcome: 1}),
	label,
	title,
}: Props<K>) => {
	const {loading, value, setValue} = useSetting(setting);

	const [error, setError] = useState(false);

	useEffect(() => {
		const {outcome} = validate(value);
		setError(!outcome);
	}, [validate, value]);

	const onChange = async (e) => {
		const newValue = sanitize(e.target.value);
		await setValue(newValue);
	};

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
