import React from 'react';
import {styled} from '@mui/material/styles';
import {useNavigate} from 'react-router-dom';

import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import HomeIcon from '@mui/icons-material/Home';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

const PREFIX = 'RestoreAppAfterErrorButtons';

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

type RestoreAppAfterErrorButtonsProps = {
	retry: () => void;
};

const RestoreAppAfterErrorButtons = ({
	retry,
}: RestoreAppAfterErrorButtonsProps) => {
	const navigate = useNavigate();

	const reloadRoute = () => {
		navigate(0);
	};

	const goBackHome = () => {
		navigate('/');
		retry();
	};

	const reloadApp = () => {
		navigate('/');
		navigate(0);
	};

	return (
		<Buttons className={classes.buttons}>
			<Button
				className={classes.button}
				variant="contained"
				color="primary"
				endIcon={<RotateRightIcon />}
				onClick={retry}
			>
				Re-render current route
			</Button>
			<Button
				className={classes.button}
				variant="contained"
				color="secondary"
				endIcon={<RefreshIcon />}
				onClick={reloadRoute}
			>
				Reload current route
			</Button>
			<br />
			<Button
				className={classes.button}
				variant="contained"
				color="primary"
				endIcon={<HomeIcon />}
				onClick={goBackHome}
			>
				Render home page
			</Button>
			<Button
				className={classes.button}
				variant="contained"
				color="secondary"
				endIcon={<PowerSettingsNewIcon />}
				onClick={reloadApp}
			>
				Reload entire App
			</Button>
		</Buttons>
	);
};

export default RestoreAppAfterErrorButtons;
