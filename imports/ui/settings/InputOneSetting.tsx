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
	const {loading, value, setValue} = useSetting<K>(setting);
	const [debouncedValue, {isPending, flush}] = useDebounce(
		value as string,
		TIMEOUT_REACTIVITY_DEBOUNCE,
		// NOTE: This should really be `{leading: !loading}`, but that does
		// seem to work as `isPending` returns `true` even when leading update
		// has been taken into account. See `flush`-based workaround below.
		// SEE: https://github.com/xnimorz/use-debounce/issues/192
		{leading: false},
	);
	useEffect(() => {
		// NOTE: Flush when loading is done.
		if (!loading) flush();
	}, [loading, flush]);

	const [displayedValue, setDisplayedValue] = useState(value as string);
	const [ignoreUpdates, setIgnoreUpdates] = useState(false);

	const error = useMemo(
		() => !validate(displayedValue).outcome,
		[validate, displayedValue],
	);

	useEffect(() => {
		if (ignoreUpdates) return;
		setDisplayedValue((prev) => (isPending() ? prev : debouncedValue));
	}, [ignoreUpdates, isPending, debouncedValue]);

	const onChange = useMemo(() => {
		let last = {};

		const updateValue = debounce(async (current: unknown, newValue: string) => {
			try {
				await setValue(newValue as UserSettings[K]);
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
		}, TIMEOUT_INPUT_DEBOUNCE);

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
