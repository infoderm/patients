import React, {useState} from 'react';

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import FileCopyIcon from '@mui/icons-material/FileCopy';

import {useSnackbar} from 'notistack';
import IconButton from '@mui/material/IconButton';
import call from '../../api/endpoint/call';
import generate from '../../api/endpoint/permissions/token/generate';
import useSaveTextToClipboardAndNotify from '../input/useSaveTextToClipboardAndNotify';
import {ICS_CALENDAR_READ} from '../../api/permissions/codes';

type Props = {
	className?: string;
};

const PermissionTokenGenerationButton = ({className}: Props) => {
	const [generating, setGenerating] = useState(false);
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const saveTextToClipboard = useSaveTextToClipboardAndNotify();

	// TODO allow user to configure
	const permissions = [ICS_CALENDAR_READ];

	// TODO add progress line
	const onClick = async () => {
		let token;
		setGenerating(true);
		try {
			token = await call(generate, permissions);
			setGenerating(false);
		} catch (error: unknown) {
			console.debug({error});
			setGenerating(false);
			const message = error instanceof Error ? error.message : 'unknown error';
			enqueueSnackbar(message, {variant: 'error'});
			return;
		}

		enqueueSnackbar(
			`Your new token is ready,
			save it somewhere safe (we do not store it): ${token}`,
			{
				variant: 'info',
				action: (key) => (
					<IconButton
						size="large"
						onClick={() => {
							saveTextToClipboard(token);
							closeSnackbar(key);
						}}
					>
						<FileCopyIcon />
					</IconButton>
				),
			},
		);
	};

	return (
		<Button
			className={className}
			color="primary"
			disabled={generating}
			endIcon={<AddIcon />}
			onClick={onClick}
		>
			Generate
		</Button>
	);
};

export default PermissionTokenGenerationButton;
