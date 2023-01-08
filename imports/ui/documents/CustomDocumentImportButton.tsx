import React from 'react';
import {type useNavigate} from 'react-router-dom';

import {useSnackbar} from 'notistack';

import {any} from '@iterable-iterator/reduce';
import {map} from '@iterable-iterator/map';

import insertDocument from '../../api/documents/insertDocument';
import debounceSnackbar from '../../util/debounceSnackbar';
import GenericDocumentImportButton from './GenericDocumentImportButton';

const CustomDocumentImportButton = (props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const onImport = async (
		navigate: ReturnType<typeof useNavigate>,
		files: File[],
	) => {
		const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
		feedback('Processing documents...', {variant: 'info', persist: true});
		try {
			if (any(map(({type}) => type === 'application/pdf', files))) {
				throw new Error(
					'Cannot import PDFs! Please attach them to the patient directly.',
				);
			}

			await Promise.all(
				map(async (file) => insertDocument(navigate, undefined, file), files),
			);
			feedback('Success!', {variant: 'success'});
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'unknown error';
			console.error(message);
			console.debug({error});
			feedback(message, {variant: 'error'});
		}
	};

	return <GenericDocumentImportButton onImport={onImport} {...props} />;
};

export default CustomDocumentImportButton;
