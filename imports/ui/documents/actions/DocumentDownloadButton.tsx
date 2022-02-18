import React from 'react';

import LoadingButton, {LoadingButtonProps} from '@mui/lab/LoadingButton';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import {DocumentDocument} from '../../../api/collection/documents';
import DocumentDownloadGenericButton from './DocumentDownloadGenericButton';

type DocumentDownloadButtonProps = Omit<
	LoadingButtonProps<'button'>,
	'loading' | 'onClick' | 'children'
> & {document: DocumentDocument};

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
