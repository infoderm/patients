import React, {useState} from 'react';

import type PropsOf from '../../../util/types/PropsOf';

import {type DocumentDocument} from '../../../api/collection/documents';
import DocumentRestorationDialog from '../DocumentRestorationDialog';

type DocumentRestorationGenericButtonProps<C extends React.ElementType> = {
	readonly document: Pick<DocumentDocument, '_id' | 'deleted'>;
	readonly component: C;
	readonly hideWhenDisabled: boolean;
} & PropsOf<C>;

const DocumentRestorationGenericButton = <C extends React.ElementType>({
	document,
	component: Component,
	hideWhenDisabled,
	...rest
}: DocumentRestorationGenericButtonProps<C>) => {
	const [restoring, setRestoring] = useState(false);
	const disabled = !document.deleted;

	return (
		<>
			{(!disabled || !hideWhenDisabled) && (
				<Component
					color="primary"
					disabled={disabled}
					onClick={() => {
						setRestoring(true);
					}}
					{...rest}
				/>
			)}
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

export default DocumentRestorationGenericButton;
