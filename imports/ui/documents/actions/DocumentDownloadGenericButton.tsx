import React from 'react';

import type PropsOf from '../../../util/types/PropsOf';

import {
	type DocumentDownloadTarget,
	useDocumentDownload,
} from './downloadDocument';

type DocumentDownloadGenericButtonProps<C extends React.ElementType> = {
	readonly document: DocumentDownloadTarget;
	readonly component: C;
	readonly disableLoadingFeedback?: boolean;
} & PropsOf<C>;

const DocumentDownloadGenericButton = <C extends React.ElementType>({
	document,
	component: Component,
	disableLoadingFeedback,
	...rest
}: DocumentDownloadGenericButtonProps<C>) => {
	const [downloading, download] = useDocumentDownload(document);

	return (
		<Component
			color="primary"
			loading={disableLoadingFeedback ? undefined : downloading}
			onClick={download}
			{...rest}
		/>
	);
};

export default DocumentDownloadGenericButton;
