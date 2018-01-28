import { Meteor } from 'meteor/meteor' ;

import React from 'react' ;

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import DeleteIcon from 'material-ui-icons/Delete';

import { Patients } from '../api/patients.js';

export default class Patient extends React.Component {

	deleteThisPatient() {
		Meteor.call('patients.remove', this.props.patient._id);
	}

	render() {
		return (
			<Grid item xs={12} sm={6}>
				<strong>{this.props.patient.firstname} {this.props.patient.lastname.toUpperCase()} </strong>
				<span>{this.props.patient.sex}</span>
				<span>{this.props.patient.birthdate}</span>
				<span>{this.props.patient.niss}</span>
				<Button fab color="primary" aria-label="delete" onClick={this.deleteThisPatient.bind(this)}>
					<DeleteIcon />
				</Button>
			</Grid>
		);
	}

}
