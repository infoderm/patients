import React from 'react' ;
import { withRouter } from 'react-router-dom' ;

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import MenuIcon from '@material-ui/icons/Menu';

import { all } from '@aureooms/js-itertools' ;
import { map } from '@aureooms/js-itertools' ;
import { filter } from '@aureooms/js-itertools' ;
import { take } from '@aureooms/js-itertools' ;
import { list } from '@aureooms/js-itertools' ;

import { settings } from '../api/settings.js';

import { onlyLowerCaseASCII } from '../api/string.js';

import SearchBox from './patients/SearchBox.js';
import AccountsUI from './users/AccountsUI.js';

import Downshift from 'downshift';

const drawerWidth = 240;

const styles = theme => ({
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
    marginLeft: theme.spacing.unit * 3,
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
});

function getSuggestions(suggestions, inputValue) {

  const needles = onlyLowerCaseASCII(inputValue).split(' ');

  return list(
    take(
      filter(
	suggestion => {

	  const haystack = onlyLowerCaseASCII(suggestion.label);

	  return all(map(needle => haystack.includes(needle), needles));

	} ,
	suggestions
      ),
      5
    )
  );
}

class Header extends React.Component {

  constructor(props){
    super(props);
  }

  handleChange = (selectedItem, downshiftState) => {
    if ( selectedItem ) {
      const { history } = this.props;
      history.push(`/patient/${selectedItem._id}`);
    }
  };

  reduceState = (state, changes) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
	return {
	  ...changes,
	  inputValue: '',
	};
      default:
	return changes;
    }
  };

  toggleNavigationDrawerIsOpen = e => {

    const {
      navigationDrawerIsOpen ,
    } = this.props ;

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


  render(){

    const {
      classes,
      patients,
      currentUser,
      navigationDrawerIsOpen,
    } = this.props;

    const suggestions = patients.map(
      patient => ({
	label : `${patient.lastname} ${patient.firstname}` ,
	_id : patient._id ,
      })
    ) ;

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
            onClick={this.toggleNavigationDrawerIsOpen}
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
	  { currentUser && <SearchBox
	    className={classes.searchBox}
	    filter={getSuggestions}
	    suggestions={suggestions}
	    itemToString={item => item ? item.label : ''}
	    onChange={this.handleChange}
	    stateReducer={this.reduceState}
	  /> }
	  <AccountsUI
	    className={classes.accounts}
	    currentUser={currentUser}
	  />
	</Toolbar>
      </AppBar>
      );
}
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter( withStyles(styles, { withTheme: true }) (Header) ) ;
