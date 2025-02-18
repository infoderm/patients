import React, {useState, useEffect, useMemo, startTransition} from 'react';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import debounce from 'debounce';
import {useDebounce} from 'use-debounce';

import {type SettingKey} from '../../api/settings';

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
	const [debouncedValue, {isPending, cancel}] = useDebounce(
		value,
		TIMEOUT_REACTIVITY_DEBOUNCE,
	);
	const [displayedValue, setDisplayedValue] = useState(value as string);
	const [pending, setPending] = useState<Promise<void> | undefined>(undefined);

	const [error, setError] = useState(false);

	const changed = useChanged([debouncedValue]);

	useEffect(() => {
		if (!pending && changed && debouncedValue !== undefined) {
			setDisplayedValue((prev) =>
				isPending() ? prev : (debouncedValue as string),
			);
		}
	}, [pending, isPending, debouncedValue]);

	useEffect(() => {
		const {outcome} = validate(displayedValue);
		setError(!outcome);
	}, [validate, displayedValue]);

	const updateValue = useMemo(
		() =>
			debounce(async (newValue) => {
				let current: Promise<void>;
				try {
					current = setValue(newValue);
					setPending(current);
					await current;
				} finally {
					setTimeout(() => {
						startTransition(() => {
							// NOTE: This works because all method calls are queued in calling
							// order.
							// eslint-disable-next-line @typescript-eslint/promise-function-async
							setPending((last) => (last === current ? undefined : last));
						});
					}, TIMEOUT_REACTIVITY_DEBOUNCE);
				}
			}, TIMEOUT_INPUT_DEBOUNCE),
		[setValue, setPending],
	);

	const onChange = async (e) => {
		cancel();
		const newValue = sanitize(e.target.value);
		setDisplayedValue(newValue);
		await updateValue(newValue);
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
