import React, { Component } from 'react' ;
import { Meteor } from 'meteor/meteor' ;

import { Patients } from '../api/patients.js';

export default class Patient extends Component {

	deleteThisPatient() {
		Meteor.call('patients.remove', this.props.patient._id);
	}

	render() {
		return (
			<li>
				<button className="delete" onClick={this.deleteThisPatient.bind(this)}>&times;</button>
				<strong>{this.props.patient.firstname} {this.props.patient.lastname} </strong>
				<span className="text">{this.props.patient.sex}</span>
				<span className="text">{this.props.patient.birthdate}</span>
				<span className="text">{this.props.patient.niss}</span>
			</li>
		);
	}

}
