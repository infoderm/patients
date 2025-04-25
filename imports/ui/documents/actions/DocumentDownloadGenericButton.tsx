import React, {useState} from 'react';

import {useSnackbar} from 'notistack';

import type PropsOf from '../../../util/types/PropsOf';

import downloadDocument, {
	type DocumentDownloadTarget,
} from './downloadDocument';

type DocumentDownloadGenericButtonProps<C extends React.ElementType> = {
	readonly document: DocumentDownloadTarget;
	readonly component: C;
} & PropsOf<C>;

const DocumentDownloadGenericButton = <C extends React.ElementType>({
	document,
	component: Component,
	...rest
}: DocumentDownloadGenericButtonProps<C>) => {
	const {enqueueSnackbar} = useSnackbar();
	const [downloading, setDownloading] = useState(false);

	const onClick = async () => {
		setDownloading(true);
		try {
			await downloadDocument(document);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'unknown error';
			console.error(message);
			console.debug({error});
			enqueueSnackbar(message, {variant: 'error'});
		} finally {
			setDownloading(false);
		}
	};

	return (
		<Component
			color="primary"
			loading={downloading}
			onClick={onClick}
			{...rest}
		/>
	);
};

export default DocumentDownloadGenericButton;
