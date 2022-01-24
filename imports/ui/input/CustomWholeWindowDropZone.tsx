import React from 'react';
import {useSnackbar} from 'notistack';
import useOnDrop from '../drag-and-drop/useOnDrop';
import WholeWindowDropZone from './WholeWindowDropZone';

export default function CustomWholeWindowDropZone() {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const onDrop = useOnDrop();
	const callback = async (data) => {
		const key = enqueueSnackbar('Processing data...', {variant: 'info'});
		try {
			await onDrop(data);
			closeSnackbar(key);
			enqueueSnackbar('Success!', {variant: 'success'});
		} catch (error: unknown) {
			closeSnackbar(key);
			const message = error instanceof Error ? error.message : 'unknown error';
			console.error(message);
			console.debug({error});
			enqueueSnackbar(message, {variant: 'error'});
		}
	};

	return (
		<WholeWindowDropZone callback={callback} aria-label="Drop contents here" />
	);
}
