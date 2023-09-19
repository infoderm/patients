import React from 'react';

import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import LoadingIconButton from '../../button/LoadingIconButton';
import type PropsOf from '../../../lib/types/PropsOf';
import {type DocumentDocument} from '../../../api/collection/documents';

import DocumentDownloadGenericButton from './DocumentDownloadGenericButton';

type DocumentDownloadIconButtonProps = Omit<
	PropsOf<typeof LoadingIconButton>,
	'loading' | 'onClick' | 'children'
> & {readonly document: DocumentDocument};

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
