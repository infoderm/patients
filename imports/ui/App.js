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

import WholeWindowDropZone from './WholeWindowDropZone.js';
import Header from './Header.js';
import Main from './Main.js';
import NavigationDrawer from './NavigationDrawer.js';

const muitheme = createMuiTheme();

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

		const { classes, theme, currentUser, patients, history } = this.props;

		return (
			<MuiThemeProvider theme={muitheme}>
				<div>
					<CssBaseline/>
					<WholeWindowDropZone callback={handleDrop(history)}/>
					<div className={classes.appFrame}>
						<Header patients={patients} currentUser={currentUser}/>
						<NavigationDrawer/>
						<Main currentUser={currentUser} patients={patients}/>
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
		return {
			currentUser: Meteor.user() ,
			patients: Patients.find({}, { sort: { lastname: 1 } }).fetch() ,
			//allCount: Patients.find({}).count() ,
			//femaleCount: Patients.find({ sex: 'female'}).count() ,
			//maleCount: Patients.find({ sex: 'male'}).count() ,
			//otherCount: Patients.find({ sex: 'other'}).count() ,
		};
	}) ( withStyles(styles, { withTheme: true }) (App) )
);
