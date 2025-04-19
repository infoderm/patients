import React, {useState} from 'react';

import type PropsOf from '../../../util/types/PropsOf';

import {type DocumentDocument} from '../../../api/collection/documents';
import DocumentDeletionDialog from '../DocumentDeletionDialog';

type DocumentDownloadGenericButtonAdditionalProps<C extends React.ElementType> =
	{
		readonly document: Pick<DocumentDocument, '_id' | 'deleted'>;
		readonly component: C;
	} & PropsOf<C>;

const DocumentDownloadGenericButton = <C extends React.ElementType>({
	document,
	component: Component,
	...rest
}: DocumentDownloadGenericButtonAdditionalProps<C>) => {
	const [deleting, setDeleting] = useState(false);

	if (document.deleted) return null;

	return (
		<>
			<Component
				color="secondary"
				onClick={() => {
					setDeleting(true);
				}}
				{...rest}
			/>
			<DocumentDeletionDialog
				open={deleting}
				document={document}
				onClose={() => {
					setDeleting(false);
				}}
			/>
		</>
	);
};

export default DocumentDownloadGenericButton;
