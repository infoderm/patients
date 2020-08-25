import React from 'react';

import StaticPatientCard from './StaticPatientCard.js';

import {usePatient} from '../../api/patients.js';

const ReactivePatientCard = ({patient}) => {
	const patientId = patient._id;

	// The options fields key selects fields whose updates we want to subscribe
	// to. Here we subscribe to everything needed to display a
	// StaticPatientCard.
	const options = {fields: StaticPatientCard.projection};
	// We could unsubscribe from the photo fields updates. This would avoid double
	// loading when first loading the photo via a query response, then via this
	// subscription.
	// delete options.fields['photo'];

	const deps = [
		patientId,
		JSON.stringify(patient),
		JSON.stringify(StaticPatientCard.projection)
	];
	const {loading, found, fields} = usePatient(
		patient,
		patientId,
		options,
		deps
	);
	const props = {loading, found, patient: fields};

	return <StaticPatientCard {...props} />;
};

export default ReactivePatientCard;
