import React from 'react';

import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import LoadingIconButton from '../../button/LoadingIconButton';
import PropsOf from '../../../util/PropsOf';
import {DocumentDocument} from '../../../api/collection/documents';
import DocumentDownloadGenericButton from './DocumentDownloadGenericButton';

type DocumentDownloadIconButtonProps = Omit<
	PropsOf<typeof LoadingIconButton>,
	'loading' | 'onClick' | 'children'
> & {document: DocumentDocument};

const DocumentDownloadIconButton = (props: DocumentDownloadIconButtonProps) => (
	<DocumentDownloadGenericButton
		component={LoadingIconButton}
		size="large"
		{...props}
	>
		<CloudDownloadIcon />
	</DocumentDownloadGenericButton>
);

export default DocumentDownloadIconButton;
