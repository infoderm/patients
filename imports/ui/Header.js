import React from 'react' ;
import { useLocation } from 'react-router-dom' ;

import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import MenuIcon from '@material-ui/icons/Menu';

import { settings } from '../api/settings.js';

import PatientsSearchBox from './patients/PatientsSearchBox.js';
import AccountsUI from './users/AccountsUI.js';

const drawerWidth = 240;

const useStyles = makeStyles(
  theme => ({
    appBar: {
      position: 'fixed',
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
	easing: theme.transitions.easing.sharp,
	duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
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
    searchBox:{
      flex: 'none',
    },
    accounts:{
      flex: 'none',
    },
  })
);


export default function Header ( { currentUser , navigationDrawerIsOpen , patients } ) {

  const classes = useStyles();
  const location = useLocation();

  const toggleNavigationDrawerIsOpen = e => {

    const setting = 'navigation-drawer-is-open';

    const newValue = navigationDrawerIsOpen === 'open' ? 'closed' : 'open' ;

    Meteor.call(settings.methods.update, setting, newValue, (err, res) => {

      if ( err ) {
	console.error(err) ;
      }
      else {
	console.debug('Setting', setting, 'updated to', newValue) ;
      }

    }) ;

  } ;

  return (
    <AppBar className={classNames(classes.appBar, {
      [classes.appBarShift]: navigationDrawerIsOpen === 'open',
      })}>
      <Toolbar
	className={classes.toolBar}
      >
	<IconButton
	  color="inherit"
	  aria-label="Open drawer"
	  onClick={toggleNavigationDrawerIsOpen}
	  className={classNames(classes.menuButton, {
	  [classes.hide]: navigationDrawerIsOpen === 'open',
	  })}
	>
	  <MenuIcon />
	</IconButton>
	<Typography
	  className={classes.title}
	  variant="h6"
	  color="inherit"
	>
	  {location.pathname}
	</Typography>
	<div style={{flex:'1 1 auto'}}></div>
	{ currentUser && <PatientsSearchBox
	  className={classes.searchBox}
	  patients={patients}
	/> }
	<AccountsUI
	  className={classes.accounts}
	  currentUser={currentUser}
	/>
      </Toolbar>
    </AppBar>
    );
}
