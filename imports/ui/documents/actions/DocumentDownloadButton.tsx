import React from 'react';

import LoadingButton, {type LoadingButtonProps} from '@mui/lab/LoadingButton';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import {type DocumentDocument} from '../../../api/collection/documents';

import DocumentDownloadGenericButton from './DocumentDownloadGenericButton';

type DocumentDownloadButtonProps = Omit<
	LoadingButtonProps,
	'loading' | 'onClick' | 'children'
> & {readonly document: DocumentDocument};

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
