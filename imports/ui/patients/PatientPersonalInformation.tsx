import React from 'react';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import PatientPersonalInformationStatic from './PatientPersonalInformationStatic';

import usePatient from './usePatient';

type PatientPersonalInformationProps = {
	readonly patientId: string;
};

const PatientPersonalInformation = ({
	patientId,
}: PatientPersonalInformationProps) => {
	const init = {};
	const query = {filter: {_id: patientId}};
	const deps = [patientId];

	const {loading, found, fields: patient} = usePatient(init, query, deps);

	if (loading) return <Loading />;

	if (!found) {
		return <NoContent>Patient not found.</NoContent>;
	}

	return (
		<PatientPersonalInformationStatic found loading={false} patient={patient} />
	);
};

export default PatientPersonalInformation;
