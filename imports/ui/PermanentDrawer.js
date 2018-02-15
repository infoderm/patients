import React from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List, {
  ListItem,
  ListItemIcon,
  ListItemText,
} from 'material-ui/List';
import { MenuItem } from 'material-ui/Menu';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';

const drawerWidth = 240;

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: drawerWidth,
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
          <Link to="/">
            <ListItem button>
              <ListItemText primary="Patients"/>
            </ListItem>
          </Link>
          <Link to="/new">
            <ListItem button>
              <ListItemText primary="Add patient"/>
            </ListItem>
          </Link>
        </List>
        <Divider/>
        <List>
          <Link to="/drugs">
            <ListItem button>
              <ListItemText primary="Drugs"/>
            </ListItem>
          </Link>
        </List>
      </Drawer>
    );
}

PermanentDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PermanentDrawer);
