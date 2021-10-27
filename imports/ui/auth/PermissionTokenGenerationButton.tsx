import React, {useState} from 'react';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import {useSnackbar} from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import call from '../../api/endpoint/call';
import generate from '../../api/endpoint/permissions/token/generate';
import useSaveTextToClipboardAndNotify from '../input/useSaveTextToClipboardAndNotify';
import {ICS_CALENDAR_READ} from '../../api/permissions/codes';

interface Props {
	className?: string;
}

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
