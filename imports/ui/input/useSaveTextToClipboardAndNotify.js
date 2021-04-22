import {useSnackbar} from 'notistack';
import saveTextToClipboard from '../../client/saveTextToClipboard.js';

/**
 * useSaveTextToClipboardAndNotify.
 *
 * @param {string} text
 */
const useSaveTextToClipboardAndNotify = (text) => {
	const {enqueueSnackbar} = useSnackbar();

	return () => {
		saveTextToClipboard(text);
		const message = `Copied '${text}' to clipboard.`;
		enqueueSnackbar(message);
	};
};

export default useSaveTextToClipboardAndNotify;
