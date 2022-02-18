import React, {useState} from 'react';

import {useSnackbar} from 'notistack';
import PropsOf from '../../../util/PropsOf';
import {DocumentDocument} from '../../../api/collection/documents';
import downloadDocument from './downloadDocument';

interface ExtraProps {
	document: DocumentDocument;
	component: React.ElementType;
	children: React.ReactNode;
	size?: string;
}

const DocumentDownloadGenericButton = ({
	document,
	component: Component,
	...rest
}: PropsOf<typeof Component> & ExtraProps) => {
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
