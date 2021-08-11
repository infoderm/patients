import React from 'react';
import {useLocation} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import MenuIcon from '@material-ui/icons/Menu';

import {setSetting} from '../client/settings';

import FullTextSearchInput from './search/FullTextSearchInput';
import AccountsUI from './users/AccountsUI';

import {drawerWidthOpen} from './NavigationDrawer';

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'fixed',
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidthOpen,
		width: `calc(100% - ${drawerWidthOpen}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: 24,
	},
	hide: {
		display: 'none',
	},
	toolBar: {
		display: 'flex',
		flex: 'auto',
	},
	title: {
		minWidth: 100,
		flex: 'initial',
		marginLeft: theme.spacing(3),
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	searchBox: {
		flex: 'none',
	},
	accounts: {
		flex: 'none',
	},
}));

export default function Header({currentUser, navigationDrawerIsOpen}) {
	const classes = useStyles();
	const location = useLocation();

	const toggleNavigationDrawerIsOpen = () => {
		const newValue = navigationDrawerIsOpen === 'open' ? 'closed' : 'open';
		setSetting('navigation-drawer-is-open', newValue);
	};

	return (
		<AppBar
			className={classNames(classes.appBar, {
				[classes.appBarShift]: navigationDrawerIsOpen === 'open',
			})}
		>
			<Toolbar className={classes.toolBar}>
				<IconButton
					color="inherit"
					aria-label="Open drawer"
					className={classNames(classes.menuButton, {
						[classes.hide]: navigationDrawerIsOpen === 'open',
					})}
					onClick={toggleNavigationDrawerIsOpen}
				>
					<MenuIcon />
				</IconButton>
				<Typography className={classes.title} variant="h6" color="inherit">
					{location.pathname}
				</Typography>
				<div style={{flex: '1 1 auto'}} />
				{currentUser && <FullTextSearchInput className={classes.searchBox} />}
				<AccountsUI className={classes.accounts} currentUser={currentUser} />
			</Toolbar>
		</AppBar>
	);
}
