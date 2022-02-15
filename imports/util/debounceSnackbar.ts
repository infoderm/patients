import {SnackbarKey, OptionsObject} from 'notistack';

const DEBOUNCE_DELAY = 500;

const debounceSnackbar = ({enqueueSnackbar, closeSnackbar}) => {
	let key: SnackbarKey;
	let timeout;
	return (message: string, options: OptionsObject) => {
		clearTimeout(timeout);
		if (key !== undefined) closeSnackbar(key);
		timeout = setTimeout(() => {
			key = enqueueSnackbar(message, options);
		}, DEBOUNCE_DELAY);
	};
};

export default debounceSnackbar;
