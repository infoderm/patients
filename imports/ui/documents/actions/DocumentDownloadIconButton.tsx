import React from 'react';

import IconButton from '@mui/material/IconButton';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import DocumentDownloadGenericButton from './DocumentDownloadGenericButton';

const DocumentDownloadIconButton = (props) => (
	<DocumentDownloadGenericButton component={IconButton} size="large" {...props}>
		<CloudDownloadIcon />
	</DocumentDownloadGenericButton>
);

export default DocumentDownloadIconButton;
