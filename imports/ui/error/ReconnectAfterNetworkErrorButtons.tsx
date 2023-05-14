import React from 'react';
import {styled} from '@mui/material/styles';

import LoadingButton from '@mui/lab/LoadingButton';
import CableIcon from '@mui/icons-material/Cable';

import useStatus from '../users/useStatus';
import reconnect from '../../api/connection/reconnect';

const Buttons = styled('div')({
	textAlign: 'center',
	paddingBottom: '2em',
});

const Button = styled(LoadingButton)({
	margin: '1em',
});

const ReconnectAfterNetworkErrorButtons = () => {
	const {status} = useStatus();

	const connecting = status === 'connecting';
	const connected = status === 'connected';

	return (
		<Buttons>
			<Button
				variant="contained"
				endIcon={<CableIcon />}
				loading={connecting}
				loadingPosition="end"
				disabled={connected}
				onClick={reconnect}
			>
				{connected ? 'Connected' : 'Reconnect'}
			</Button>
		</Buttons>
	);
};

export default ReconnectAfterNetworkErrorButtons;
