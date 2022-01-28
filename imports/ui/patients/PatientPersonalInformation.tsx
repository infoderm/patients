import React from 'react';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import PatientPersonalInformationStatic from './PatientPersonalInformationStatic';

import usePatient from './usePatient';

interface PatientPersonalInformationProps {
	patientId: string;
}

const PatientPersonalInformation = ({
	patientId,
}: PatientPersonalInformationProps) => {
	const init = {};
	const query = patientId;
	const options = {};
	const deps = [query];

	const {
		loading,
		found,
		fields: patient,
	} = usePatient(init, query, options, deps);

	if (loading) return <Loading />;

	if (!found) {
		return <NoContent>Patient not found.</NoContent>;
	}

	return <PatientPersonalInformationStatic patient={patient} />;
};

export default PatientPersonalInformation;
