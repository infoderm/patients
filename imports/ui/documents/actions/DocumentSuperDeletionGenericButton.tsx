import React, {useState} from 'react';

import type PropsOf from '../../../util/types/PropsOf';

import {type DocumentDocument} from '../../../api/collection/documents';
import DocumentSuperDeletionDialog from '../DocumentSuperDeletionDialog';

type DocumentSuperDeletionGenericButtonProps<C extends React.ElementType> = {
	readonly document: Pick<DocumentDocument, '_id' | 'deleted'>;
	readonly component: C;
	readonly hideWhenDisabled: boolean;
} & PropsOf<C>;

const DocumentSuperDeletionGenericButton = <C extends React.ElementType>({
	document,
	component: Component,
	hideWhenDisabled,
	...rest
}: DocumentSuperDeletionGenericButtonProps<C>) => {
	const [superDeleting, setSuperDeleting] = useState(false);
	const disabled = !document.deleted;

	return (
		<>
			{(!disabled || !hideWhenDisabled) && (
				<Component
					color="secondary"
					disabled={disabled}
					onClick={() => {
						setSuperDeleting(true);
					}}
					{...rest}
				/>
			)}
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
