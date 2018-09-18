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
import ReportProblemIcon from '@material-ui/icons/ReportProblem';

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

function NavigationDrawer ( { classes } ) {
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
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon>
              <FaceIcon/>
            </ListItemIcon>
            <ListItemText primary="Patients"/>
          </ListItem>
          <ListItem button component={Link} to={`/calendar/${format(startOfToday(), 'YYYY-MM-DD')}`}>
            <ListItemIcon>
              <FolderSharedIcon/>
            </ListItemIcon>
            <ListItemText primary="Consultations"/>
          </ListItem>
          <ListItem button component={Link} to="/calendar">
            <ListItemIcon>
              <TodayIcon/>
            </ListItemIcon>
            <ListItemText primary="Calendar"/>
          </ListItem>
          <ListItem disabled button component={Link} to="/appointments">
            <ListItemIcon>
              <AccessTimeIcon/>
            </ListItemIcon>
            <ListItemText primary="Appointments"/>
          </ListItem>
        </List>
        <Divider/>
        <List>
          <ListItem button component={Link} to="/stats">
            <ListItemIcon>
              <ShowChartIcon/>
            </ListItemIcon>
            <ListItemText primary="Stats"/>
          </ListItem>
          <ListItem disabled button component={Link} to="/books">
            <ListItemIcon>
              <BookIcon/>
            </ListItemIcon>
            <ListItemText primary="Carnets"/>
          </ListItem>
          <ListItem button component={Link} to="/unpaid">
            <ListItemIcon>
              <MoneyOffIcon/>
            </ListItemIcon>
            <ListItemText primary="Unpaid"/>
          </ListItem>
          <ListItem button component={Link} to="/issues">
            <ListItemIcon>
              <ReportProblemIcon/>
            </ListItemIcon>
            <ListItemText primary="Issues"/>
          </ListItem>
        </List>
        <Divider/>
        <List>
          <ListItem button component={Link} to="/doctors">
            <ListItemIcon>
              <SupervisorAccountIcon/>
            </ListItemIcon>
            <ListItemText primary="Doctors"/>
          </ListItem>
          <ListItem disabled button component={Link} to="/insurances">
            <ListItemIcon>
              <BusinessIcon/>
            </ListItemIcon>
            <ListItemText primary="Insurances"/>
          </ListItem>
          <ListItem disabled button component={Link} to="/allergies">
            <ListItemIcon>
              <BugReportIcon/>
            </ListItemIcon>
            <ListItemText primary="Allergies"/>
          </ListItem>
        </List>
        <Divider/>
        <List>
          <ListItem button component={Link} to="/drugs">
            <ListItemIcon>
              <LocalPharmacyIcon/>
            </ListItemIcon>
            <ListItemText primary="Drugs"/>
          </ListItem>
          <ListItem disabled button component={Link} to="/hospitals">
            <ListItemIcon>
              <LocalHospitalIcon/>
            </ListItemIcon>
            <ListItemText primary="Hospitals"/>
          </ListItem>
        </List>
      </Drawer>
    );
}

NavigationDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavigationDrawer);
