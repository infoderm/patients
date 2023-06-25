import {useCallback} from 'react';
import {useSnackbar} from 'notistack';

import saveTextToClipboard from '../output/saveTextToClipboard';

/**
 * useSaveTextToClipboardAndNotify.
 */
const useSaveTextToClipboardAndNotify = () => {
	const {enqueueSnackbar} = useSnackbar();

	return useCallback(
		(text) => {
			saveTextToClipboard(text);
			const message = `Copied '${text}' to clipboard.`;
			enqueueSnackbar(message);
		},
		[enqueueSnackbar],
	);
};

export default useSaveTextToClipboardAndNotify;
