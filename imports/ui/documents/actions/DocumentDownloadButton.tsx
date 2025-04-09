import React from 'react';

import LoadingButton, {type LoadingButtonProps} from '@mui/lab/LoadingButton';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import DocumentDownloadGenericButton from './DocumentDownloadGenericButton';
import {type DocumentDownloadTarget} from './downloadDocument';

type DocumentDownloadButtonProps = Omit<
	LoadingButtonProps,
	'loading' | 'onClick' | 'children'
> & {readonly document: DocumentDownloadTarget};

const DocumentDownloadButton = (props: DocumentDownloadButtonProps) => (
	<DocumentDownloadGenericButton
		component={LoadingButton}
		endIcon={<CloudDownloadIcon />}
		loadingPosition="end"
		{...props}
	>
		Download
	</DocumentDownloadGenericButton>
);

export default DocumentDownloadButton;
