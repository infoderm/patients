import React from 'react';

import Button from '@mui/material/Button';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import DocumentDownloadGenericButton from './DocumentDownloadGenericButton';

const DocumentDownloadButton = (props) => (
	<DocumentDownloadGenericButton component={Button} {...props}>
		Download
		<CloudDownloadIcon />
	</DocumentDownloadGenericButton>
);

export default DocumentDownloadButton;
