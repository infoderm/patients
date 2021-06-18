import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import PatientPersonalInformationStatic from './PatientPersonalInformationStatic';

import usePatient from './usePatient';

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
