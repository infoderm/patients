import { Meteor } from 'meteor/meteor' ;

import React, { Component } from 'react' ;
import { CollectionItem , Button } from 'react-materialize' ;

import { Patients } from '../api/patients.js';

export default class Patient extends Component {

	deleteThisPatient() {
		Meteor.call('patients.remove', this.props.patient._id);
	}

	render() {
		return (
			<CollectionItem>
				<strong>{this.props.patient.firstname} {this.props.patient.lastname} </strong>
				<span>{this.props.patient.sex}</span>
				<span>{this.props.patient.birthdate}</span>
				<span>{this.props.patient.niss}</span>
				<Button className="red" onClick={this.deleteThisPatient.bind(this)} icon="delete"/>
			</CollectionItem>
		);
	}

}
