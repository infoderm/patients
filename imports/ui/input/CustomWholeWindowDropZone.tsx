import React from 'react';
import {useSnackbar} from 'notistack';
import useOnDrop from '../drag-and-drop/useOnDrop';
import debounceSnackbar from '../snackbar/debounceSnackbar';
import WholeWindowDropZone from './WholeWindowDropZone';

export default function CustomWholeWindowDropZone() {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const onDrop = useOnDrop();
	const callback = async (data) => {
		const update = debounceSnackbar({enqueueSnackbar, closeSnackbar});
		update('Processing data...', {variant: 'info'});
		try {
			await onDrop(data);
			update('Success!', {variant: 'success'});
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'unknown error';
			console.error(message);
			console.debug({error});
			update(message, {variant: 'error'});
		}
	};

	return (
		<WholeWindowDropZone callback={callback} aria-label="Drop contents here" />
	);
}
