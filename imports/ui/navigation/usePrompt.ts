import type {Blocker, History, Transition} from 'history';
import {type ContextType, useCallback, useContext, useEffect} from 'react';
import {
	type Navigator as BaseNavigator,
	UNSAFE_NavigationContext as NavigationContext,
} from 'react-router-dom';

type Navigator = {
	block: History['block'];
} & BaseNavigator;

type NavigationContextWithBlock = ContextType<typeof NavigationContext> & {
	navigator: Navigator;
};

/**
 * @source https://github.com/remix-run/react-router/commit/256cad70d3fd4500b1abcfea66f3ee622fb90874
 */
const useBlocker = (blocker: Blocker, when = true): void => {
	const {navigator} = useContext(
		NavigationContext,
	) as NavigationContextWithBlock;

	useEffect(() => {
		if (!when) {
			return undefined;
		}

		const unblock = navigator.block((tx: Transition) => {
			const autoUnblockingTx = {
				...tx,
				retry() {
					// Automatically unblock the transition so it can play all the way
					// through before retrying it. TODO: Figure out how to re-enable
					// this block if the transition is cancelled for some reason.
					unblock();
					tx.retry();
				},
			};

			blocker(autoUnblockingTx);
		});

		return unblock;
	}, [navigator, blocker, when]);
};

/**
 * @source https://github.com/remix-run/react-router/issues/8139#issuecomment-1021457943
 */
const usePrompt = (
	message:
		| string
		| ((
				location: Transition['location'],
				action: Transition['action'],
		  ) => string),
	when = true,
): void => {
	const blocker = useCallback(
		(tx: Transition) => {
			let response;
			if (typeof message === 'function') {
				response = message(tx.location, tx.action);
				if (typeof response === 'string') {
					// eslint-disable-next-line no-alert
					response = window.confirm(response);
				}
			} else {
				// eslint-disable-next-line no-alert
				response = window.confirm(message);
			}

			if (response) {
				tx.retry();
			}
		},
		[message],
	);
	useBlocker(blocker, when);
};

export default usePrompt;
