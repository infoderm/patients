import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;

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

import { Patients } from '../api/patients.js';

import NewPatientForm from './NewPatientForm.js';
import Patient from './Patient.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

const theme = createMuiTheme();

class App extends React.Component {

	constructor(props){
		super(props);

		this.state = {
			filterSex: 'all',
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
		return (
			<MuiThemeProvider theme={theme}>
			<div>
				<Reboot/>
				<AppBar position="static">
					<Toolbar>
						<Typography type="title" color="inherit" style={{flex:1}}>DERMATODOC</Typography>
						<AccountsUIWrapper/>
					</Toolbar>
				</AppBar>
				<Select
					label="Filter by sex"
					value={this.state.filterSex}
					onChange={e => this.setState({ filterSex: e.target.value })}
				>
					<MenuItem value="all">All</MenuItem>
					<MenuItem value="female">Only female</MenuItem>
					<MenuItem value="male">Only male</MenuItem>
					<MenuItem value="other">Only other</MenuItem>
				</Select>
				<div style={{ padding: 12 }}>
				{ this.props.currentUser ? <NewPatientForm/> : '' }
					<Grid container spacing={24}>
						{this.renderPatients()}
					</Grid>
				</div>
			</div>
			</MuiThemeProvider>
		);
	}
}

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
}) (App);
