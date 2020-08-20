import React from 'react';
import {useHistory} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import HomeIcon from '@material-ui/icons/Home';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

import NoContent from './navigation/NoContent.js';

const useStyles = makeStyles((theme) => ({
	explanation: {
		textAlign: 'center',
		fontSize: '1.3em',
		fontWeight: 'bold'
	},
	details: {
		padding: '1em'
	},
	summary: {
		fontSize: '2em',
		cursor: 'pointer',
		color: '#d44'
	},
	pre: {
		whiteSpace: 'pre-wrap',
		backgroundColor: '#333',
		color: '#ccc',
		padding: '1.5em',
		borderRadius: '.5em',
		textTransform: 'initial'
	},
	rightIcon: {
		marginLeft: theme.spacing(1)
	},
	buttons: {
		textAlign: 'center',
		paddingBottom: '2em'
	},
	button: {
		margin: '1em'
	}
}));

export default function ErrorPage({error, errorInfo, retry}) {
	const classes = useStyles();
	const history = useHistory();

	const reloadRoute = () => history.go(0);
	const goBackHome = () => {
		history.push('/');
		retry();
	};

	const reloadApp = () => {
		history.push('/');
		history.go(0);
	};

	return (
		<div>
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
					onClick={retry}
				>
					Re-render current route
					<RotateRightIcon className={classes.rightIcon} />
				</Button>
				<Button
					className={classes.button}
					variant="contained"
					color="secondary"
					onClick={reloadRoute}
				>
					Reload current route
					<RefreshIcon className={classes.rightIcon} />
				</Button>
				<br />
				<Button
					className={classes.button}
					variant="contained"
					color="primary"
					onClick={goBackHome}
				>
					Render home page
					<HomeIcon className={classes.rightIcon} />
				</Button>
				<Button
					className={classes.button}
					variant="contained"
					color="secondary"
					onClick={reloadApp}
				>
					Reload entire App
					<PowerSettingsNewIcon className={classes.rightIcon} />
				</Button>
			</div>
			<details className={classes.details}>
				<summary className={classes.summary}>Show error log</summary>
				<pre className={classes.pre}>
					{error && error.toString()}
					<br />
					{errorInfo.componentStack}
				</pre>
			</details>
		</div>
	);
}
