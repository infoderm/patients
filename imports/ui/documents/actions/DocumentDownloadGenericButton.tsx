import React, {useState} from 'react';

import {useSnackbar} from 'notistack';
import type PropsOf from '../../../util/PropsOf';
import {type DocumentDocument} from '../../../api/collection/documents';
import downloadDocument from './downloadDocument';

type ExtraProps = {
	document: DocumentDocument;
	component: React.ElementType;
	children: React.ReactNode;
	size?: string;
};

const DocumentDownloadGenericButton = ({
	document,
	component: Component,
	...rest
}: // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
PropsOf<typeof Component> & ExtraProps) => {
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
