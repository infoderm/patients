import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;

import PropTypes from 'prop-types';
import classNames from 'classnames' ;
import { withStyles } from 'material-ui/styles';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import Reboot from 'material-ui/Reboot';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import Grid from 'material-ui/Grid';

import TextField from 'material-ui/TextField'
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu'
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import DoneIcon from 'material-ui-icons/Done';
import Zoom from 'material-ui/transitions/Zoom';
import blue from 'material-ui/colors/blue';
import green from 'material-ui/colors/green';

import { Patients } from '../api/patients.js';

import NewPatientForm from './NewPatientForm.js';
import Patient from './Patient.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

const muitheme = createMuiTheme();

const styles = theme => ({
	fab: {
		position: 'fixed',
		bottom: theme.spacing.unit * 2,
		right: theme.spacing.unit * 2,
	},
	filterSex: {
		marginLeft: "2rem",
	},
	dropzone: {
		position: "fixed",
		top: 0,
		left: 0,
		width: "100%",
		height: "100vh",
		backgroundColor: blue[900],
	}
});

class App extends React.Component {

	constructor(props){
		super(props);

		this.state = {
			filterSex: 'all',
			creationMode: false,
		};
	}

	renderPatients() {
		let patients = this.props.patients;
		if (this.state.filterSex != 'all') {
			patients = patients.filter(patient => patient.sex === this.state.filterSex);
		}
		return patients.map(patient => (
			<Patient key={patient._id} patient={patient}/>
		));
	}

	render(){

		const { classes, theme } = this.props;

		const transitionDuration = {
		  enter: theme.transitions.duration.enteringScreen,
		  exit: theme.transitions.duration.leavingScreen,
		}

		return (
			<MuiThemeProvider theme={muitheme}>
			<div>
				<Reboot/>
				<div id="dropzone" className={classes.dropzone}>
					<Button fab color='primary'>
						<AddIcon />
					</Button>
				</div>
				<AppBar position="static">
					<Toolbar>
						<Typography type="title" color="inherit" style={{flex:1}}>DERMATODOC</Typography>
						<AccountsUIWrapper/>
						<Select
							className={classes.filterSex}
							label="Filter by sex"
							value={this.state.filterSex}
							onChange={e => this.setState({ filterSex: e.target.value })}
						>
							<MenuItem value="all">All</MenuItem>
							<MenuItem value="female">Only female</MenuItem>
							<MenuItem value="male">Only male</MenuItem>
							<MenuItem value="other">Only other</MenuItem>
						</Select>
					</Toolbar>
				</AppBar>
				<div style={{ padding: 12 }}>
					{ this.props.currentUser && this.state.creationMode ? <NewPatientForm/> : '' }
					{ this.state.creationMode ? '' :
					<Grid container spacing={24}>
						{this.renderPatients()}
					</Grid> }
				</div>
				<Zoom
					appear={false}
					key="Start creation"
					in={!this.state.creationMode}
					timeout={transitionDuration}
					enterDelay={transitionDuration.exit}
					unmountOnExit
				>
					<Button fab className={classes.fab} color='primary' onClick={e => this.setState({creationMode: true})}>
						<AddIcon />
					</Button>
				</Zoom>
				<Zoom
					appear={false}
					key="Save creation"
					in={this.state.creationMode}
					timeout={transitionDuration}
					enterDelay={transitionDuration.exit}
					unmountOnExit
				>
					<Button fab className={classes.fab} color='secondary' onClick={e => this.setState({creationMode: false})}>
						<DoneIcon />
					</Button>
				</Zoom>
			</div>
			</MuiThemeProvider>
		);
	}
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withTracker(() => {
	Meteor.subscribe('patients');
	return {
		currentUser: Meteor.user() ,
		patients: Patients.find({}, { sort: { firstname: 1 } }).fetch() ,
		//allCount: Patients.find({}).count() ,
		//femaleCount: Patients.find({ sex: 'female'}).count() ,
		//maleCount: Patients.find({ sex: 'male'}).count() ,
		//otherCount: Patients.find({ sex: 'other'}).count() ,
	};
}) ( withStyles(styles, { withTheme: true }) (App) );
