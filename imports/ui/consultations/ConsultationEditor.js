import React from 'react';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';

import ConsultationForm from './ConsultationForm.js';

const ConsultationEditor = ({loading, found, consultation}) => {
	if (loading) return <Loading />;

	if (!found) {
		return <NoContent>Consultation not found.</NoContent>;
	}

	return <ConsultationForm consultation={consultation} />;
};

export default ConsultationEditor;
