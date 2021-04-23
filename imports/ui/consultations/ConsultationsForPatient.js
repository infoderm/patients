import React from 'react';

import usePatient from '../patients/usePatient.js';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';
import FixedFab from '../button/FixedFab.js';

import ConsultationsPager from './ConsultationsPager.js';
import ManageConsultationsForPatientButton from './ManageConsultationsForPatientButton.js';

const ConsultationsForPatient = (props) => {
	const {patientId, page, perpage} = props;

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
		isDone: true
	};

	const sort = {datetime: -1};

	return (
		<>
			<ConsultationsPager
				root={`/patient/${patientId}/consultations`}
				page={page}
				perpage={perpage}
				query={query}
				sort={sort}
				defaultExpandedFirst={page === 1}
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
