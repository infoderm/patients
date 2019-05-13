import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data' ;

import { Patients } from '../api/patients.js';

import React from 'react' ;
import { withRouter } from 'react-router-dom' ;

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';

import handleDrop from '../client/handleDrop.js';
import { settings } from '../api/settings.js';

import WholeWindowDropZone from './input/WholeWindowDropZone.js';
import Header from './Header.js';
import Router from './Router.js';
import NavigationDrawer from './NavigationDrawer.js';


const muitheme = createMuiTheme();

const drawerWidth = 240;

const styles = theme => ({
	appFrame: {
		position: 'relative',
		display: 'flex',
		width: '100%',
		minHeight: '100vh',
	},
});

class App extends React.Component {

	constructor(props){
		super(props);
	}

	render(){

		const {
			classes,
			theme,
			currentUser,
			patients,
			history,
			textTransform,
			navigationDrawerIsOpen,
		} = this.props;

		return (
			<MuiThemeProvider theme={muitheme}>
				<div>
					<CssBaseline/>
					<WholeWindowDropZone callback={handleDrop(history)}/>
					<div className={classes.appFrame} style={{textTransform}}>
						<Header
							navigationDrawerIsOpen={navigationDrawerIsOpen}
							patients={patients}
							currentUser={currentUser}
						/>
						<NavigationDrawer
							navigationDrawerIsOpen={navigationDrawerIsOpen}
							currentUser={currentUser}
						/>
						<Router
							navigationDrawerIsOpen={navigationDrawerIsOpen}
							currentUser={currentUser}
							history={history}
							patients={patients}
						/>
					</div>
				</div>
			</MuiThemeProvider>
		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
};

export default withRouter(
	withTracker(() => {
		Meteor.subscribe('patients');
		settings.subscribe('text-transform');
		settings.subscribe('navigation-drawer-is-open');
		return {
			textTransform: settings.get('text-transform') ,
			navigationDrawerIsOpen: settings.get('navigation-drawer-is-open') ,
			currentUser: Meteor.user() ,
			patients: Patients.find({}, { sort: { lastname: 1 } }).fetch() ,
		};
	}) ( withStyles(styles, { withTheme: true }) (App) )
);
