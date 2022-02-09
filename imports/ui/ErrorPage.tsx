import React from 'react';
import {styled} from '@mui/material/styles';
import {useNavigate} from 'react-router-dom';

import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import HomeIcon from '@mui/icons-material/Home';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

import NoContent from './navigation/NoContent';

const PREFIX = 'ErrorPage';

const classes = {
	explanation: `${PREFIX}-explanation`,
	details: `${PREFIX}-details`,
	summary: `${PREFIX}-summary`,
	pre: `${PREFIX}-pre`,
	buttons: `${PREFIX}-buttons`,
	button: `${PREFIX}-button`,
};

const Root = styled('div')(() => ({
	[`& .${classes.explanation}`]: {
		textAlign: 'center',
		fontSize: '1.3em',
		fontWeight: 'bold',
	},

	[`& .${classes.details}`]: {
		padding: '1em',
	},

	[`& .${classes.summary}`]: {
		fontSize: '2em',
		cursor: 'pointer',
		color: '#d44',
	},

	[`& .${classes.pre}`]: {
		whiteSpace: 'pre-wrap',
		backgroundColor: '#333',
		color: '#ccc',
		padding: '1.5em',
		borderRadius: '.5em',
		textTransform: 'initial',
	},

	[`& .${classes.buttons}`]: {
		textAlign: 'center',
		paddingBottom: '2em',
	},

	[`& .${classes.button}`]: {
		margin: '1em',
	},
}));

export default function ErrorPage({error, errorInfo, retry}) {
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
		<Root>
			<NoContent>Something went wrong.</NoContent>
			<p className={classes.explanation}>
				To restore the app to a working state first try one of the buttons.
				<br />
				If that does not work, close the app and open it again.
			</p>
			<div className={classes.buttons}>
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
			</div>
			<details className={classes.details}>
				<summary className={classes.summary}>Show error log</summary>
				<pre className={classes.pre}>
					{error?.toString()}
					<br />
					{errorInfo.componentStack}
				</pre>
			</details>
		</Root>
	);
}
