import React, { Component } from 'react' ;
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data' ;

import { Patients } from '../api/patients.js';

import Patient from './Patient.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

class App extends Component {

	constructor(props){
		super(props);

		this.state = {
			filterSex: 'all',
		};
	}

	handleSubmit(event) {

		event.preventDefault();

		const niss = ReactDOM.findDOMNode(this.refs.nissInput).value.trim();
		const firstname = ReactDOM.findDOMNode(this.refs.firstnameInput).value.trim();
		const lastname = ReactDOM.findDOMNode(this.refs.lastnameInput).value.trim();
		const birthdate = ReactDOM.findDOMNode(this.refs.birthdateInput).value.trim();
		const sex = ReactDOM.findDOMNode(this.refs.sexInput).value.trim();

		Meteor.call('patients.insert', {
			niss,
			firstname,
			lastname,
			birthdate,
			sex,
		});

		ReactDOM.findDOMNode(this.refs.nissInput).value = '';
		ReactDOM.findDOMNode(this.refs.firstnameInput).value = '';
		ReactDOM.findDOMNode(this.refs.lastnameInput).value = '';
		ReactDOM.findDOMNode(this.refs.birthdateInput).value = '';
		ReactDOM.findDOMNode(this.refs.sexInput).value = '';

	}

	handleChangeFilterSex(){
		this.setState({
			filterSex: ReactDOM.findDOMNode(this.refs.filterSexSelect).value,
		});
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
			<div className="container">
				<AccountsUIWrapper/>
				<header>
					<h1>Patients (A: {this.props.allCount}, F: {this.props.femaleCount}, M: {this.props.maleCount}, O: {this.props.otherCount})</h1>
					<label className="filter-sex">
						Filter by sex:
						<select
							readOnly
							ref="filterSexSelect"
							value={this.state.filterSex}
							onChange={this.handleChangeFilterSex.bind(this)}
						>
							<option value="all">All</option>
							<option value="female">Only female</option>
							<option value="male">Only male</option>
							<option value="other">Only other</option>
						</select>
					</label>
					{ this.props.currentUser ?
					<form className="new-patient" onSubmit={this.handleSubmit.bind(this)}>
						<input type="text" ref="nissInput" placeholder="NISS"/>
						<input type="text" ref="firstnameInput" placeholder="First name"/>
						<input type="text" ref="lastnameInput" placeholder="Last name"/>
						<select ref="sexInput" required="true">
							<option value="female">Female</option>
							<option value="male">Male</option>
							<option value="other">Other</option>
							<option value="" selected>Choose sex</option>
						</select>
						<input type="text" ref="birthdateInput" placeholder="Birth date"/>
						<input type="submit" value="Create"/>
					</form> : ''
					}
				</header>
				<ul>
					{this.renderPatients()}
				</ul>
			</div>
		);
	}
}

export default withTracker(() => {
	Meteor.subscribe('patients');
	return {
		currentUser: Meteor.user() ,
		patients: Patients.find({}, { sort: { firstname: 1 } }).fetch() ,
		allCount: Patients.find({}).count() ,
		femaleCount: Patients.find({ sex: 'female'}).count() ,
		maleCount: Patients.find({ sex: 'male'}).count() ,
		otherCount: Patients.find({ sex: 'other'}).count() ,
	};
}) (App);
