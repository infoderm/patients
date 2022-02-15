import React from 'react';
import {styled} from '@mui/material/styles';

import LoadingButton from '@mui/lab/LoadingButton';
import CableIcon from '@mui/icons-material/Cable';

import useStatus from '../users/useStatus';
import reconnect from '../../api/connection/reconnect';

const PREFIX = 'ReconnectAfterNetworkErrorButtons';

const classes = {
	buttons: `${PREFIX}-buttons`,
	button: `${PREFIX}-button`,
};

const Buttons = styled('div')(() => ({
	[`&.${classes.buttons}`]: {
		textAlign: 'center',
		paddingBottom: '2em',
	},

	[`& .${classes.button}`]: {
		margin: '1em',
	},
}));

const ReconnectAfterNetworkErrorButtons = () => {
	const {status} = useStatus();

	const connecting = status === 'connecting';
	const connected = status === 'connected';

	return (
		<Buttons className={classes.buttons}>
			<LoadingButton
				className={classes.button}
				variant="contained"
				endIcon={<CableIcon />}
				loading={connecting}
				loadingPosition="end"
				disabled={connected}
				onClick={reconnect}
			>
				{connected ? 'Connected' : 'Reconnect'}
			</LoadingButton>
		</Buttons>
	);
};

export default ReconnectAfterNetworkErrorButtons;
