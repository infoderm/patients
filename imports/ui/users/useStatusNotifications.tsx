import React, {useCallback, useEffect, useRef} from 'react';

import {type SnackbarKey, useSnackbar} from 'notistack';

import Button from '@mui/material/Button';

import {msToStringShort} from '../../api/duration';
import reconnect from '../../api/connection/reconnect';

import useStatus from './useStatus';

const DEBOUNCE_DELAY = 500;

const useStatusNotifications = () => {
	const isFirstRender = useRef(true);

	const {status, retryCount, retryTime, reason} = useStatus();

	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const action = useCallback(
		(key) => (
			<>
				<Button
					color="inherit"
					onClick={() => {
						closeSnackbar(key);
					}}
				>
					Dismiss
				</Button>
				<Button
					color="inherit"
					onClick={() => {
						reconnect();
					}}
				>
					Connect
				</Button>
			</>
		),
		[closeSnackbar],
	);

	useEffect(() => {
		let key: SnackbarKey | undefined;
		const timeout = setTimeout(() => {
			switch (status) {
				case 'connected': {
					if (!isFirstRender.current) {
						key = enqueueSnackbar('You are connected', {variant: 'success'});
					}

					break;
				}

				case 'connecting': {
					key = enqueueSnackbar('Connecting', {
						variant: 'default',
						persist: true,
					});
					break;
				}

				case 'failed': {
					key = enqueueSnackbar(
						`All connection attempts have failed: ${reason}.`,
						{variant: 'error', persist: true, action},
					);
					break;
				}

				case 'waiting': {
					const msBeforeNextRetry = retryTime! - Date.now();
					key = enqueueSnackbar(
						`You are disconnected: waiting ${msToStringShort(
							msBeforeNextRetry,
						)} before next connection attempt (#${retryCount})`,
						{variant: 'warning', persist: true, action},
					);
					break;
				}

				case 'offline': {
					key = enqueueSnackbar('You are working offline', {
						variant: 'info',
						persist: true,
						action,
					});
					break;
				}

				default: {
					key = enqueueSnackbar(`Unknown connection status: ${status}`, {
						variant: 'error',
						persist: true,
						action,
					});
				}
			}

			isFirstRender.current = false;
		}, DEBOUNCE_DELAY);

		return () => {
			clearTimeout(timeout);
			if (key !== undefined) closeSnackbar(key);
		};
	}, [
		status,
		retryCount,
		retryTime,
		reason,
		enqueueSnackbar,
		closeSnackbar,
		action,
	]);
};

export default useStatusNotifications;
