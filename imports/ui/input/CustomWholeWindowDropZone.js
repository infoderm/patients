import React from 'react';
import {useSnackbar} from 'notistack';
import useOnDrop from '../../client/useOnDrop';
import WholeWindowDropZone from './WholeWindowDropZone';

export default function CustomWholeWindowDropZone() {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const onDrop = useOnDrop();
	const callback = (data) => {
		const key = enqueueSnackbar('Processing data...', {variant: 'info'});
		try {
			onDrop(data);
			closeSnackbar(key);
			enqueueSnackbar('Success!', {variant: 'success'});
		} catch (error) {
			closeSnackbar(key);
			enqueueSnackbar(error.message, {variant: 'error'});
		}
	};

	return <WholeWindowDropZone callback={callback} />;
}
