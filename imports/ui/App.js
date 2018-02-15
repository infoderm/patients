import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import { withRouter } from 'react-router-dom'

import PropTypes from 'prop-types';
import classNames from 'classnames' ;
import { withStyles } from 'material-ui/styles';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import Reboot from 'material-ui/Reboot';

import insertFromXML from '../client/insertFromXML.js';
import { Patients } from '../api/patients.js';

import WholeWindowDropZone from './WholeWindowDropZone.js';
import Header from './Header.js';
import Main from './Main.js';
import PermanentDrawer from './PermanentDrawer.js';

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
		this.header = null;
	}

	render(){

		const { classes, theme, currentUser, patients } = this.props;

		return (
			<MuiThemeProvider theme={muitheme}>
				<div>
					<Reboot/>
					<WholeWindowDropZone callback={insertFromXML}/>
					<div className={classes.appFrame}>
						<Header ref={node => this.header = node} patients={patients}/>
						<PermanentDrawer/>
						<Main currentUser={currentUser} patients={patients} filterSex={'all'}/>
					</div>
				</div>
			</MuiThemeProvider>
		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withRouter(
	withTracker(() => {
		Meteor.subscribe('patients');
		return {
			currentUser: Meteor.user() ,
			patients: Patients.find({}, { sort: { firstname: 1 } }).fetch() ,
			//allCount: Patients.find({}).count() ,
			//femaleCount: Patients.find({ sex: 'female'}).count() ,
			//maleCount: Patients.find({ sex: 'male'}).count() ,
			//otherCount: Patients.find({ sex: 'other'}).count() ,
		};
	}) ( withStyles(styles, { withTheme: true }) (App) )
);
