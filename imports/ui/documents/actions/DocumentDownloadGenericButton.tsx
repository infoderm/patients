import React, {useState} from 'react';

import {styled} from '@mui/material/styles';
import {blue} from '@mui/material/colors';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import {useSnackbar} from 'notistack';
import PropsOf from '../../../util/PropsOf';
import downloadDocument from './downloadDocument';

const Button = styled(Box)({
	position: 'relative',
	display: 'inline',
});

const Progress = styled(CircularProgress)({
	color: blue[900],
	position: 'absolute',
	top: -14,
	left: 0,
	zIndex: 1,
});

type Props<C> = {
	document: {};
	component: React.ElementType;
} & PropsOf<C>;

const DocumentDownloadGenericButton = ({
	document,
	component: Component,
	...rest
}: Props<typeof Component>) => {
	const {enqueueSnackbar} = useSnackbar();
	const [downloading, setDownloading] = useState(false);

	const onClick = async () => {
		setDownloading(true);
		try {
			await downloadDocument(document);
			setDownloading(false);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'unknown error';
			console.error(message);
			console.debug({error});
			enqueueSnackbar(message, {variant: 'error'});
			setDownloading(false);
		}
	};

	const props = downloading ? {...rest, disabled: true} : rest;

	return (
		<Button>
			<Component color="primary" onClick={onClick} {...props} />
			{downloading && <Progress size={48} />}
		</Button>
	);
};

export default DocumentDownloadGenericButton;
