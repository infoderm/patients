import React from 'react';

import {useSnackbar} from 'notistack';

import {any} from '@iterable-iterator/reduce';
import {map} from '@iterable-iterator/map';

import insertDocument from '../../api/documents/insertDocument';
import GenericDocumentImportButton from './GenericDocumentImportButton';

const CustomDocumentImportButton = (props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const onImport = async (history, files) => {
		const key = enqueueSnackbar('Processing documents...', {variant: 'info'});
		try {
			if (any(map(({type}) => type === 'application/pdf', files))) {
				throw new Error(
					'Cannot import PDFs! Please attach them to the patient directly.',
				);
			}

			await Promise.all(
				map(async (file) => insertDocument(history, undefined, file), files),
			);
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

	return <GenericDocumentImportButton onImport={onImport} {...props} />;
};

export default CustomDocumentImportButton;
