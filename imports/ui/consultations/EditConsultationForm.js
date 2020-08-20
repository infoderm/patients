import {Meteor} from 'meteor/meteor';

import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';

import ConsultationForm from './ConsultationForm.js';

import {Consultations} from '../../api/consultations.js';

const EditConsultationForm = ({loading, consultation}) => {
	if (loading) {
		return <div>Loading...</div>;
	}

	if (!consultation) {
		return <div>Error: Consultation not found.</div>;
	}

	return <ConsultationForm consultation={consultation} />;
};

export default withTracker(({match}) => {
	const _id = match.params.id;
	const handle = Meteor.subscribe('consultation', _id);
	if (handle.ready()) {
		const consultation = Consultations.findOne(_id);
		return {loading: false, consultation};
	}

	return {loading: true};
})(EditConsultationForm);
