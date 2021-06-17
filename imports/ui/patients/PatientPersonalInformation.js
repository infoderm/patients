import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';

import PatientPersonalInformationStatic from './PatientPersonalInformationStatic.js';

import usePatient from './usePatient.js';

const PatientPersonalInformation = ({patientId}) => {
	const init = {};
	const query = patientId;
	const options = {};
	const deps = [query];

	const {
		loading,
		found,
		fields: patient
	} = usePatient(init, query, options, deps);

	if (loading) return <Loading />;

	if (!found) {
		return <NoContent>Patient not found.</NoContent>;
	}

	return <PatientPersonalInformationStatic patient={patient} />;
};

PatientPersonalInformation.propTypes = {
	patientId: PropTypes.string.isRequired
};

export default PatientPersonalInformation;
