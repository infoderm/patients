import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';

import PatientPersonalInformationStatic from './PatientPersonalInformationStatic.js';

import {Patients} from '../../api/patients.js';

const PatientPersonalInformation = ({loading, patient}) => {
	if (loading) {
		return <Loading />;
	}

	if (!patient) {
		return <NoContent>Patient not found.</NoContent>;
	}

	return <PatientPersonalInformationStatic patient={patient} />;
};

PatientPersonalInformation.propTypes = {
	loading: PropTypes.bool.isRequired,
	patient: PropTypes.object
};

export default withTracker(({patientId}) => {
	const handle = Meteor.subscribe('patient', patientId);

	if (handle.ready()) {
		const patient = Patients.findOne(patientId);
		return {loading: false, patient};
	}

	return {loading: true};
})(PatientPersonalInformation);
