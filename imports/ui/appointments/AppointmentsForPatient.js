import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';

import {Patients} from '../../api/patients.js';
import {Consultations} from '../../api/consultations.js';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';

import AppointmentsForPatientStatic from './AppointmentsForPatientStatic.js';

const AppointmentsForPatient = (props) => {
	const {loading, patient, ...rest} = props;

	if (loading) {
		return <Loading />;
	}

	if (!patient) {
		return <NoContent>Error: Patient not found.</NoContent>;
	}

	return <AppointmentsForPatientStatic {...rest} />;
};

export default withTracker(({patientId, page, perpage}) => {
	const patientHandle = Meteor.subscribe('patient', patientId);
	const appointmentsHandle = Meteor.subscribe(
		'patient.appointments',
		patientId
	);

	const loading = !patientHandle.ready() || !appointmentsHandle.ready();

	const patient = loading ? null : Patients.findOne(patientId);

	const appointments = loading
		? []
		: Consultations.find(
				{
					patientId,
					isDone: false
				},
				{
					sort: {datetime: 1},
					skip: (page - 1) * perpage,
					limit: perpage
				}
		  ).fetch();

	return {
		patientId,
		page,
		perpage,
		loading,
		patient,
		appointments
	};
})(AppointmentsForPatient);
