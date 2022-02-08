import React from 'react';
import {useLocation} from 'react-router-dom';

import {styled} from '@mui/material/styles';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import MuiToolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import MenuIcon from '@mui/icons-material/Menu';

import {setSetting} from './settings/hooks';

import FullTextSearchInput from './search/FullTextSearchInput';
import AccountsUI from './users/AccountsUI';

import {drawerWidthOpen} from './NavigationDrawer';

const Title = styled(Typography)(({theme}) => ({
	minWidth: 100,
	flex: 'initial',
	marginLeft: theme.spacing(3),
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
}));

const Toolbar = styled(MuiToolbar)({
	display: 'flex',
	flex: 'auto',
});

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidthOpen,
		width: `calc(100% - ${drawerWidthOpen}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

export default function Header({currentUser, navigationDrawerIsOpen}) {
	const location = useLocation();

	const toggleNavigationDrawerIsOpen = async () => {
		const newValue = navigationDrawerIsOpen === 'open' ? 'closed' : 'open';
		await setSetting('navigation-drawer-is-open', newValue);
	};

	const open = navigationDrawerIsOpen === 'open';

	return (
		<AppBar position="fixed" open={open}>
			<Toolbar>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					edge="start"
					sx={{
						marginRight: '36px',
						...(open && {display: 'none'}),
					}}
					onClick={toggleNavigationDrawerIsOpen}
				>
					<MenuIcon />
				</IconButton>
				<Title variant="h6" color="inherit">
					{location.pathname}
				</Title>
				<div style={{flex: '1 1 auto'}} />
				{currentUser && <FullTextSearchInput sx={{flex: 'none'}} />}
				<AccountsUI sx={{flex: 'none'}} currentUser={currentUser} />
			</Toolbar>
		</AppBar>
	);
}
