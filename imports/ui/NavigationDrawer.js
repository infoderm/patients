import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data' ;
import React from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import format from 'date-fns/format' ;
import startOfToday from 'date-fns/start_of_today' ;


import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import FaceIcon from '@material-ui/icons/Face';
import AddIcon from '@material-ui/icons/Add';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import BusinessIcon from '@material-ui/icons/Business';
import BugReportIcon from '@material-ui/icons/BugReport';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import TodayIcon from '@material-ui/icons/Today';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import LocalPharmacyIcon from '@material-ui/icons/LocalPharmacy';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import PaymentIcon from '@material-ui/icons/Payment';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import BookIcon from '@material-ui/icons/Book';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import SettingsIcon from '@material-ui/icons/Settings';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

import { settings } from '../api/settings.js';

const drawerWidthOpen = 240;

const styles = theme => ({
  drawerPaper: {
    position: 'fixed',
    height: '100vh',
    overflowY: 'scroll',
  },
  drawerOpen: {
      width: drawerWidthOpen,
      transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
      }),
  },
  drawerClosed: {
      transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing.unit * 7 + 1,
      [theme.breakpoints.up('sm')]: {
          width: theme.spacing.unit * 9 + 1,
      },
  },
  drawer: {
    width: drawerWidthOpen,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
});

class NavigationDrawer extends React.Component {

  constructor(props) {
    super(props);
  }

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

  render ( ) {

    const { classes, theme, currentUser, navigationDrawerIsOpen } = this.props ;

    const blocks = [

      {

        title : 'main' ,

        links : [

          {
            to: "/" ,
            icon: <FaceIcon/> ,
            title: "Patients"
          } ,

          {
            to: `/consultations/${format(startOfToday(), 'YYYY-MM-DD')}` ,
            icon: <FolderSharedIcon/> ,
            title: "Consultations"
          } ,

          {
            to: "/documents" ,
            icon: <LibraryBooksIcon/> ,
            title: "Documents" ,
          } ,


          {
            to: "/calendar" ,
            icon: <TodayIcon/> ,
            title: "Calendar" ,
          } ,

          {
            //to: "/appointments" ,
            to: `/calendar/month/${format(startOfToday(), 'YYYY/MM')}` ,
            icon: <AccessTimeIcon/> ,
            title: "Appointments" ,
            disabled: true ,
          } ,

          {
            to: '/import' ,
            icon: <CloudUploadIcon/> ,
            title: 'Import' ,
          } ,

        ] ,

      } ,

      {

        title: 'management' ,

        links: [

          {
            to: "/books" ,
            icon: <BookIcon/> ,
            title: "Carnets" ,
          } ,

          {
            to: "/sepa" ,
            icon: <AccountBalanceIcon/> ,
            title: "SEPA" ,
          } ,

          {
            to: "/wired" ,
            icon: <PaymentIcon/> ,
            title: "Virements" ,
          } ,

          {
            to: "/unpaid" ,
            icon: <MoneyOffIcon/> ,
            title: "Unpaid" ,
          } ,

          {
            to: "/stats" ,
            icon: <ShowChartIcon/> ,
            title: "Stats" ,
            disabled: true ,
          } ,

        ] ,

      } ,

      {
        title: 'issues' ,

        links: [

          {
            to: "/issues" ,
            icon: <ReportProblemIcon/> ,
            title: "Issues" ,
          } ,

          {
            to: "/merge" ,
            icon: <MergeTypeIcon/> ,
            title: "Merge" ,
          } ,

        ] ,

      } ,

      {

        title: 'tags' ,

        links: [

          {
            to: "/doctors" ,
            icon: <SupervisorAccountIcon/> ,
            title: "Doctors" ,
          } ,

          {
            to: "/insurances" ,
            icon: <BusinessIcon/> ,
            title: "Insurances" ,
          } ,

          {
            to: "/allergies" ,
            icon: <BugReportIcon/> ,
            title: "Allergies" ,
          } ,

        ] ,

      } ,

      {

        title: 'external' ,

        links: [
          {
            to: "/drugs" ,
            icon: <LocalPharmacyIcon/> ,
            title: "Drugs" ,
            disabled: true ,
          } ,

          {
            to: "/hospitals" ,
            icon: <LocalHospitalIcon/> ,
            title: "Hospitals" ,
            disabled: true ,
          } ,

        ] ,

      } ,

      {

        title: 'app' ,

        links: [

          {
            to: "/settings" ,
            icon: <SettingsIcon/> ,
            title: "Settings" ,
          } ,

        ] ,

      } ,

    ] ;

    return (
      <Drawer
        open={navigationDrawerIsOpen === 'open'}
        variant="permanent"
        className={
          classNames({
            [classes.drawerOpen]: navigationDrawerIsOpen === 'open',
            [classes.drawerClosed]: navigationDrawerIsOpen === 'closed',
          })
        }
        classes={{
          paper: classNames({
            [classes.drawerOpen]: navigationDrawerIsOpen === 'open',
            [classes.drawerClosed]: navigationDrawerIsOpen === 'closed',
          })
        }}
        anchor="left"
      >
        <div className={classes.drawerHeader}>
            <IconButton onClick={this.toggleNavigationDrawerIsOpen}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
        </div>
        <Divider/>

        {
          blocks.map( ({ title , links }) => (
          <div key={title}>
            <List>
              {
                links.map( link => (
                  <ListItem key={link.to} disabled={!currentUser || link.disabled} button component={Link} to={link.to}>
                    <ListItemIcon>{link.icon}</ListItemIcon>
                    { navigationDrawerIsOpen === 'open' ? <ListItemText primary={link.title}/> : null }
                  </ListItem>
                ) )
              }
            </List>
            <Divider/>
          </div>
          ) )
        }
      </Drawer>
      );
  }

}

NavigationDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withTracker(() => {
  return {};
    //const appointmentDurationHandle = settings.subscribe('navigation-drawer-is-open') ;
    //if (appointmentDurationHandle.ready()) {
      //return {
        //state: settings.get('navigation-drawer-is-open') ,
      //} ;
    //}
    //else {
      //return {
        //state: 'closed' ,
      //};
    //}
}) ( withStyles(styles, { withTheme: true }) (NavigationDrawer) ) ;
