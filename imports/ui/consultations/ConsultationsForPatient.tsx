import React from 'react';

import usePatient from '../patients/usePatient';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';
import FixedFab from '../button/FixedFab';

import ConsultationsPager from './ConsultationsPager';
import ManageConsultationsForPatientButton from './ManageConsultationsForPatientButton';

type Props = {
	patientId: string;
};

const ConsultationsForPatient = ({patientId}: Props) => {
	const options = {fields: {_id: 1}};

	const deps = [patientId];

	const {loading, found} = usePatient({}, patientId, options, deps);

	if (loading) {
		return <Loading />;
	}

	if (!found) {
		return <NoContent>Patient not found.</NoContent>;
	}

	const query = {
		patientId,
		isDone: true,
	};

	const sort = {datetime: -1};

	return (
		<>
			<ConsultationsPager
				defaultExpandedFirst
				query={query}
				sort={sort}
				perpage={5}
			/>
			<ManageConsultationsForPatientButton
				Button={FixedFab}
				col={4}
				color="primary"
				patientId={patientId}
				tooltip="Ask for directions"
			/>
		</>
	);
};

export default ConsultationsForPatient;
