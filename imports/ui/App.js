import React, { Component } from 'react' ;
import ReactDOM from 'react-dom';
import { Breadcrumb , MenuItem , Row , Input , Button , Collection , Navbar , NavItem } from 'react-materialize';
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

		this.form = {
		};

		this.filter = {
		};

	}

	handleSubmit(event) {

		event.preventDefault();

		console.log(this.form);

		const niss = this.form.niss.state.value.trim();
		const firstname = this.form.firstname.state.value.trim();
		const lastname = this.form.lastname.state.value.trim();
		const birthdate = this.form.birthdate.state.value.trim();
		const sex = this.form.sex.state.value.trim();

		Meteor.call('patients.insert', {
			niss,
			firstname,
			lastname,
			birthdate,
			sex,
		});

		this.form.niss.input.value = '';
		this.form.firstname.input.value = '';
		this.form.lastname.input.value = '';
		this.form.birthdate.dateInput.value = '';
		this.form.sex.selectInput.value = '';

	}

	handleChangeFilterSex(value){
		this.setState({
			filterSex: value,
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
			<div>
			<Navbar brand='Dermatodoc' right>
				<AccountsUIWrapper/>
			</Navbar>
			<div className="container">
				<header>
					<Breadcrumb>
						<MenuItem>Patients</MenuItem>
						<MenuItem>{this.state.filterSex}</MenuItem>
					</Breadcrumb>
					<Input type="select"
						label="Filter by sex"
						ref={node => this.filter.sex = node}
						value={this.state.filterSex}
						onChange={(e, value) => this.handleChangeFilterSex(value)}
					>
						<option value="all">All</option>
						<option value="female">Only female</option>
						<option value="male">Only male</option>
						<option value="other">Only other</option>
					</Input>
					{ this.props.currentUser ?
					<form className="new-patient" onSubmit={this.handleSubmit.bind(this)}>
						<Row>
							<Input s={2} label="NISS" type="text" ref={node => this.form.niss = node}/>
							<Input s={3} label="First name" type="text" ref={node => this.form.firstname = node}/>
							<Input s={3} label="Last name" type="text" ref={node => this.form.lastname = node}/>
							<Input s={1} label="Sex" type="select" ref={node => this.form.sex = node} defaultValue="">
								<option value="female">Female</option>
								<option value="male">Male</option>
								<option value="other">Other</option>
								<option value="" disabled>Sex</option>
							</Input>
							<Input s={2} label="Birth date" type="date" ref={node => this.form.birthdate = node}/>
							<Button s={1} floating large className='blue' waves='light' icon='add' />
						</Row>
					</form> : ''
					}
				</header>
				<Collection header="Patients">
					{this.renderPatients()}
				</Collection>
			</div>
		</div>
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
