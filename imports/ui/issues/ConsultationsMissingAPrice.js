import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';

import ReactiveConsultationCard from '../consultations/ReactiveConsultationCard.js';
import ReactivePatientChip from '../patients/ReactivePatientChip.js';

import {Consultations} from '../../api/consultations.js';

const ConsultationsMissingAPrice = ({loading, consultations, ...rest}) => {
	if (loading) {
		return <div {...rest}>Loading...</div>;
	}

	if (consultations.length === 0) {
		return <div {...rest}>All consultations have a price :)</div>;
	}

	return (
		<div {...rest}>
			{consultations.map((consultation) => (
				<ReactiveConsultationCard
					key={consultation._id}
					consultation={consultation}
					PatientChip={ReactivePatientChip}
				/>
			))}
		</div>
	);
};

export default withTracker(() => {
	const handle = Meteor.subscribe('consultations.missing-a-price');
	if (!handle.ready()) {
		return {loading: true};
	}

	return {
		loading: false,
		consultations: Consultations.find({
			isDone: true,
			$or: [{price: {$not: {$type: 1}}}, {price: Number.NaN}]
		}).fetch()
	};
})(ConsultationsMissingAPrice);
