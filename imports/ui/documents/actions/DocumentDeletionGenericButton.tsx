import React, {useState} from 'react';

import type PropsOf from '../../../util/types/PropsOf';

import {type DocumentDocument} from '../../../api/collection/documents';
import DocumentDeletionDialog from '../DocumentDeletionDialog';

type DocumentDeletionGenericButtonProps<C extends React.ElementType> = {
	readonly document: Pick<DocumentDocument, '_id' | 'deleted'>;
	readonly component: C;
	readonly hideWhenDisabled: boolean;
} & PropsOf<C>;

const DocumentDeletionGenericButton = <C extends React.ElementType>({
	document,
	component: Component,
	hideWhenDisabled,
	...rest
}: DocumentDeletionGenericButtonProps<C>) => {
	const [deleting, setDeleting] = useState(false);
	const disabled = document.deleted;

	return (
		<>
			{(!disabled || !hideWhenDisabled) && (
				<Component
					color="secondary"
					disabled={disabled}
					onClick={() => {
						setDeleting(true);
					}}
					{...rest}
				/>
			)}
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

export default DocumentDeletionGenericButton;
