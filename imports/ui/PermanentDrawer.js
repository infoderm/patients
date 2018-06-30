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
import TodayIcon from '@material-ui/icons/Today';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import LocalPharmacyIcon from '@material-ui/icons/LocalPharmacy';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import BookIcon from '@material-ui/icons/Book';

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

function PermanentDrawer ( { classes } ) {
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
              <SupervisorAccountIcon/>
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

PermanentDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PermanentDrawer);
