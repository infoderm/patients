import React from 'react';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';

import useConsultation from './useConsultation.js';
import ConsultationForm from './ConsultationForm.js';

const EditConsultationForm = ({match}) => {
	const init = {};
	const query = match.params.id;
	const options = {};
	const deps = [query];

	const {loading, found, fields: consultation} = useConsultation(
		init,
		query,
		options,
		deps
	);

	if (loading) return <Loading />;

	if (!found) {
		return <NoContent>Consultation not found.</NoContent>;
	}

	return <ConsultationForm consultation={consultation} />;
};

export default EditConsultationForm;
