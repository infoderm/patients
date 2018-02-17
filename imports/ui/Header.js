import React from 'react' ;

import PropTypes from 'prop-types';
import classNames from 'classnames' ;
import { withStyles } from 'material-ui/styles';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import Filter from './Filter.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import AccountsUI from './AccountsUI.js';

const drawerWidth = 240;

const styles = theme => ({
	appBar: {
		position: 'fixed',
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
	},
	title: {
		flex: '0 1 auto',
		marginLeft: theme.spacing.unit * 3,
	},
});

class Header extends React.Component {

	constructor(props){
		super(props);
	}

	render(){

		const { classes, patients, currentUser } = this.props;

		const suggestions = patients.map(
			patient => ({
				label : `${patient.firstname} ${patient.lastname}` ,
				_id : patient._id ,
			})
		) ;

		return (
			<AppBar className={classes.appBar}>
				<Toolbar>
					<Typography variant="title" color="inherit" className={classes.title}>{location.pathname}</Typography>
					<div style={{flex:'1 1 auto'}}></div>
					<Filter suggestions={suggestions}/>
					<AccountsUI currentUser={currentUser}/>
				</Toolbar>
			</AppBar>
			);
	}
}

Header.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true }) (Header) ;
