import {startTransition, useEffect, useMemo, useState} from 'react';

import debounce from 'p-debounce';
import {useDebounce} from 'use-debounce';

import useIsMounted from '../../ui/hooks/useIsMounted';

export const useSync = <T>(
	loading: boolean,
	serverValue: T,
	inputDebounceTimeout: number,
	reactivityDebounceTimeout: number,
) => {
	const [debouncedServerValue, {isPending, flush}] = useDebounce(
		serverValue,
		reactivityDebounceTimeout,
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

	const [clientValue, setClientValue] = useState(serverValue);
	const [ignoreServer, setIgnoreServer] = useState(false);

	useEffect(() => {
		if (ignoreServer) return;
		setClientValue((prev) => (isPending() ? prev : debouncedServerValue));
	}, [ignoreServer, isPending, debouncedServerValue]);

	const isMounted = useIsMounted();

	const sync = useMemo(() => {
		let last = {};

		const debouncedSetServerValue = debounce(
			async (current: unknown, setServerValue: () => Promise<void>) => {
				// TODO: We should let the consumer decide between cancelling
				// or flushing the debounced calls on unmount.
				if (!isMounted()) return;
				try {
					await setServerValue();
				} finally {
					setTimeout(() => {
						startTransition(() => {
							flush(); // NOTE: Fast-forward debounced state to current DB state.
							// NOTE: Continue ignoring updates if we are not the
							// last pending call. This works because all method
							// calls are queued in calling order.
							setIgnoreServer((prev) => (last === current ? false : prev));
						});
					}, inputDebounceTimeout + reactivityDebounceTimeout);
				}
			},
			inputDebounceTimeout,
		);

		return async (
			setClientValue: () => void,
			setServerValue: () => Promise<void>,
		) => {
			setIgnoreServer(true); // NOTE: We ignore all updates.
			const current = {};
			last = current;
			setClientValue();
			await debouncedSetServerValue(current, setServerValue);
			// NOTE: We will listen to updates again some time after last update
			// is complete.
		};
	}, [
		setIgnoreServer,
		flush,
		isMounted,
		inputDebounceTimeout,
		reactivityDebounceTimeout,
	]);

	return {
		value: clientValue,
		setValue: setClientValue,
		sync,
	};
};
