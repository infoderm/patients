import React from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';

import format from 'date-fns/format' ;
import startOfToday from 'date-fns/start_of_today' ;

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
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import BookIcon from '@material-ui/icons/Book';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import SettingsIcon from '@material-ui/icons/Settings';
import MergeTypeIcon from '@material-ui/icons/MergeType';

const drawerWidth = 240;

const styles = theme => ({
  drawerPaper: {
    position: 'fixed',
    height: '100vh',
    width: drawerWidth,
    overflowY: 'scroll',
  },
  drawerHeader: theme.mixins.toolbar,
});

function NavigationDrawer ( { classes, currentUser } ) {

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
          to: "/appointments" ,
          icon: <AccessTimeIcon/> ,
          title: "Appointments" ,
          disabled: true ,
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
          to: "/unpaid" ,
          icon: <MoneyOffIcon/> ,
          title: "Unpaid" ,
        } ,

        {
          to: "/stats" ,
          icon: <ShowChartIcon/> ,
          title: "Stats" ,
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
          disabled: true ,
        } ,

      ] ,

    } ,

  ] ;

  return (
    <Drawer
      variant="permanent"
      classes={{
      paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <div className={classes.drawerHeader} />
      <Divider/>

      {
        blocks.map( ({ title , links }) => (
        <div key={title}>
          <List>
            {
              links.map( link => (
                <ListItem key={link.to} disabled={!currentUser || link.disabled} button component={Link} to={link.to}>
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.title}/>
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

NavigationDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavigationDrawer);
