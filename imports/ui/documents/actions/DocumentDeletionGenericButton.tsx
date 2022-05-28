import React, {useState} from 'react';

import PropsOf from '../../../util/PropsOf';

import {DocumentDocument} from '../../../api/collection/documents';
import DocumentDeletionDialog from '../DocumentDeletionDialog';

interface DocumentDownloadGenericButtonAdditionalProps {
	document: DocumentDocument;
	component: React.ElementType;
}

const DocumentDownloadGenericButton = ({
	document,
	component: Component,
	...rest
}: // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
DocumentDownloadGenericButtonAdditionalProps & PropsOf<typeof Component>) => {
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
