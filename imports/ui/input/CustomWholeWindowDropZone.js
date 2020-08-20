import React from 'react';
import {useHistory} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import handleDrop from '../../client/handleDrop.js';
import WholeWindowDropZone from './WholeWindowDropZone.js';

export default function CustomWholeWindowDropZone() {
	const history = useHistory();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const onDrop = handleDrop(history);
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
