import React, {useState, useEffect, useMemo, startTransition} from 'react';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import debounce from 'p-debounce';
import {useDebounce} from 'use-debounce';

import {type UserSettings, type SettingKey} from '../../api/settings';

import {
	TIMEOUT_INPUT_DEBOUNCE,
	TIMEOUT_REACTIVITY_DEBOUNCE,
} from '../constants';

import useChanged from '../hooks/useChanged';

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
	readonly validate?: (x: string) => Outcome;
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
	const [debouncedValue, {isPending, cancel}] = useDebounce(
		value,
		TIMEOUT_REACTIVITY_DEBOUNCE,
	);
	const [displayedValue, setDisplayedValue] = useState(value as string);
	const [ignoreUpdates, setIgnoreUpdates] = useState(false);

	const [error, setError] = useState(false);

	const changed = useChanged([debouncedValue]);

	console.debug({
		loading,
		value,
		debouncedValue,
		isPending: isPending(),
		displayedValue,
		ignoreUpdates,
		error,
		changed,
	});

	useEffect(() => {
		if (!ignoreUpdates && changed && debouncedValue !== undefined) {
			setDisplayedValue((prev) =>
				isPending() ? prev : (debouncedValue as string),
			);
		}
	}, [ignoreUpdates, isPending, debouncedValue]);

	useEffect(() => {
		const {outcome} = validate(displayedValue);
		setError(!outcome);
	}, [validate, displayedValue]);

	const updateValue = useMemo(() => {
		let last = {};

		const debounced = debounce(async (newValue: UserSettings[K]) => {
			const current = {};
			last = current;
			try {
				await setValue(newValue);
			} finally {
				setTimeout(() => {
					startTransition(() => {
						// NOTE: Continue ignoring updates if we are not the
						// last pending call. This works because all method
						// calls are queued in calling order.

						setIgnoreUpdates(() => last !== current);
					});
				}, TIMEOUT_REACTIVITY_DEBOUNCE);
			}
		}, TIMEOUT_INPUT_DEBOUNCE);

		return debounced;
	}, [setValue, setIgnoreUpdates]);

	const onChange = async (e) => {
		cancel(); // NOTE: Cancel all pending debounced updates from DB.
		setIgnoreUpdates(true); // NOTE: We ignore all updates.
		const newValue = sanitize(e.target.value);
		setDisplayedValue(newValue);
		await updateValue(newValue); // NOTE: We start to listen to new updates.
		cancel(); // NOTE: Cancel all pending debounced updates from DB.
	};

	return (
		<div className={className}>
			{title && <Typography variant="h4">{title}</Typography>}
			<TextField
				disabled={loading}
				label={label}
				value={displayedValue}
				error={error}
				onChange={onChange}
			/>
		</div>
	);
};

export default InputOneSetting;
