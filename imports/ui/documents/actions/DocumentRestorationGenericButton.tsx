import React, {useState} from 'react';

import type PropsOf from '../../../util/types/PropsOf';

import {type DocumentDocument} from '../../../api/collection/documents';
import DocumentRestorationDialog from '../DocumentRestorationDialog';

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
	const [restoring, setRestoring] = useState(false);

	return (
		<>
			<Component
				color="primary"
				disabled={!document.deleted}
				onClick={() => {
					setRestoring(true);
				}}
				{...rest}
			/>
			<DocumentRestorationDialog
				open={restoring}
				document={document}
				onClose={() => {
					setRestoring(false);
				}}
			/>
		</>
	);
};

export default DocumentSuperDeletionGenericButton;
