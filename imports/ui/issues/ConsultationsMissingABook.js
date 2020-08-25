import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';

import StaticConsultationCard from '../consultations/StaticConsultationCard.js';
import ReactivePatientChip from '../patients/ReactivePatientChip.js';

import {Consultations} from '../../api/consultations.js';

const ConsultationsMissingABook = ({loading, consultations, ...rest}) => {
	if (loading) {
		return <div {...rest}>Loading...</div>;
	}

	if (consultations.length === 0) {
		return <div {...rest}>All consultations have a book :)</div>;
	}

	return (
		<div {...rest}>
			{consultations.map((consultation) => (
				<StaticConsultationCard
					key={consultation._id}
					consultation={consultation}
					PatientChip={ReactivePatientChip}
				/>
			))}
		</div>
	);
};

export default withTracker(() => {
	const query = {
		isDone: true,
		$or: [{book: null}, {book: ''}]
	};
	const handle = Meteor.subscribe('consultations', query);
	if (!handle.ready()) {
		return {loading: true};
	}

	return {
		loading: false,
		consultations: Consultations.find(query).fetch()
	};
})(ConsultationsMissingABook);
