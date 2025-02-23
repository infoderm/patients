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
	const [debouncedValue, {isPending, flush}] = useDebounce(
		value,
		TIMEOUT_REACTIVITY_DEBOUNCE,
	);
	const [displayedValue, setDisplayedValue] = useState(value as string);
	const [ignoreUpdates, setIgnoreUpdates] = useState(false);

	const error = useMemo(
		() => !validate(displayedValue).outcome,
		[validate, displayedValue],
	);

	useEffect(() => {
		if (ignoreUpdates) return;
		setDisplayedValue((prev) =>
			isPending() ? prev : (debouncedValue as string),
		);
	}, [ignoreUpdates, isPending, debouncedValue]);

	const onChange = useMemo(() => {
		let last = {};

		const updateValue = debounce(
			async (current: unknown, newValue: UserSettings[K]) => {
				try {
					await setValue(newValue);
				} finally {
					setTimeout(() => {
						startTransition(() => {
							flush(); // NOTE: Fast-forward debounced state to current DB state.
							// NOTE: Continue ignoring updates if we are not the
							// last pending call. This works because all method
							// calls are queued in calling order.
							setIgnoreUpdates((prev) => (last === current ? false : prev));
						});
					}, TIMEOUT_INPUT_DEBOUNCE + TIMEOUT_REACTIVITY_DEBOUNCE);
				}
			},
			TIMEOUT_INPUT_DEBOUNCE,
		);

		const _onChange = async (e) => {
			setIgnoreUpdates(true); // NOTE: We ignore all updates.
			const current = {};
			last = current;
			const newValue = sanitize(e.target.value);
			setDisplayedValue(newValue);
			await updateValue(current, newValue);
			// NOTE: We will listen to updates again some timer after last update
			// is complete.
		};

		return _onChange;
	}, [setValue, setIgnoreUpdates]);

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
