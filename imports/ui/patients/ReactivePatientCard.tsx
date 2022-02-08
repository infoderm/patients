import React from 'react';
import StaticPatientCard from './StaticPatientCard';

import useCachedPatient from './useCachedPatient';

interface Props {
	patient: {
		_id: string;
	};
}

const ReactivePatientCard = ({patient, ...rest}: Props) => {
	const patientId = patient._id;

	// The options fields key selects fields whose updates we want to subscribe
	// to. Here we subscribe to everything needed to display a
	// Card.
	const options = {fields: StaticPatientCard.projection};
	// We could unsubscribe from the photo fields updates. This would avoid double
	// loading when first loading the photo via a query response, then via this
	// subscription.
	// options.fields = mergeFields(options.fields, {photo: 0});
	// Currently this is not necessary since we do not preload photos.

	const deps = [patientId, JSON.stringify(StaticPatientCard.projection)];
	const {loading, found, fields} = useCachedPatient(
		{},
		patientId,
		options,
		deps,
	);
	const props = {loading, found, patient: {...patient, ...fields}};

	return <StaticPatientCard {...rest} {...props} />;
};

export default ReactivePatientCard;
