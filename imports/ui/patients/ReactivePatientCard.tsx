import React from 'react';
import StaticPatientCard from './StaticPatientCard';

import useCachedPatient from './useCachedPatient';

type Props = {
	patient: {
		_id: string;
	};
	Card?: React.ElementType;
};

const ReactivePatientCard = ({
	patient,
	Card = StaticPatientCard,
	...rest
}: Props) => {
	const patientId = patient._id;
	const projection = (Card as unknown as {projection: any}).projection;

	const query = {
		filter: {_id: patientId},
		// The options fields key selects fields whose updates we want to subscribe
		// to. Here we subscribe to everything needed to display a
		// Card.
		projection,
		// We could unsubscribe from the photo fields updates. This would avoid double
		// loading when first loading the photo via a query response, then via this
		// subscription.
		// options.fields = mergeFields(options.fields, {photo: 0});
		// Currently this is not necessary since we do not preload photos.
	};

	const deps = [patientId, JSON.stringify(projection)];
	const {loading, found, fields} = useCachedPatient({}, query, deps);
	const props = {loading, found, patient: {...patient, ...fields}};

	return <Card {...rest} {...props} />;
};

export default ReactivePatientCard;
