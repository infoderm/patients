import React, {useState} from 'react';

import type PropsOf from '../../../util/types/PropsOf';

import {type DocumentDocument} from '../../../api/collection/documents';
import DocumentSuperDeletionDialog from '../DocumentSuperDeletionDialog';

type DocumentSuperDeletionGenericButtonAdditionalProps<
	C extends React.ElementType,
> = {
	readonly document: Pick<DocumentDocument, '_id' | 'deleted'>;
	readonly component: C;
} & PropsOf<C>;

const DocumentSuperDeletionGenericButton = <C extends React.ElementType>({
	document,
	component: Component,
	...rest
}: DocumentSuperDeletionGenericButtonAdditionalProps<C>) => {
	const [superDeleting, setSuperDeleting] = useState(false);

	return (
		<>
			<Component
				color="secondary"
				disabled={!document.deleted}
				onClick={() => {
					setSuperDeleting(true);
				}}
				{...rest}
			/>
			<DocumentSuperDeletionDialog
				open={superDeleting}
				document={document}
				onClose={() => {
					setSuperDeleting(false);
				}}
			/>
		</>
	);
};

export default DocumentSuperDeletionGenericButton;
