import React, {useCallback, useEffect, useRef} from 'react';

import {useSnackbar} from 'notistack';

import Button from '@mui/material/Button';

import {msToStringShort} from '../../api/duration';
import reconnect from '../../api/connection/reconnect';
import sleep from '../../util/sleep';
import useStatus from './useStatus';

const DELAY = 500;

const useStatusNotifications = () => {
	const isFirstRender = useRef(true);

	const {status, retryCount, retryTime, reason} = useStatus();

	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const action = useCallback(
		(key) => (
			<>
				<Button
					onClick={() => {
						closeSnackbar(key);
					}}
				>
					Dismiss
				</Button>
				<Button
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
		let key;
		let isMounted = true;
		void sleep(DELAY).then(() => {
			if (!isMounted) return;
			switch (status) {
				case 'connected':
					if (!isFirstRender.current) {
						key = enqueueSnackbar('You are connected', {variant: 'success'});
					}

					break;
				case 'connecting':
					key = enqueueSnackbar('Connecting', {
						variant: 'default',
						persist: true,
					});
					break;
				case 'failed':
					key = enqueueSnackbar(
						`All connection attempts have failed: ${reason}.`,
						{variant: 'error', persist: true, action},
					);
					break;
				case 'waiting': {
					const msBeforeNextRetry = retryTime - Date.now();
					key = enqueueSnackbar(
						`You are disconnected: waiting ${msToStringShort(
							msBeforeNextRetry,
						)} before next connection attempt (#${retryCount})`,
						{variant: 'warning', persist: true, action},
					);
					break;
				}

				case 'offline':
					key = enqueueSnackbar('You are working offline', {
						variant: 'info',
						persist: true,
						action,
					});
					break;
				default:
					key = enqueueSnackbar(`Unknown connection status: ${status}`, {
						variant: 'error',
						persist: true,
						action,
					});
			}

			isFirstRender.current = false;
		});

		return () => {
			isMounted = false;
			closeSnackbar(key);
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
