import React from 'react';
import PropTypes from 'prop-types';

import StaticPatientCard from './StaticPatientCard.js';

import useCachedPatient from './useCachedPatient.js';

const ReactivePatientCard = ({patient, Card, ...rest}) => {
	const patientId = patient._id;

	// The options fields key selects fields whose updates we want to subscribe
	// to. Here we subscribe to everything needed to display a
	// Card.
	const options = {fields: Card.projection};
	// We could unsubscribe from the photo fields updates. This would avoid double
	// loading when first loading the photo via a query response, then via this
	// subscription.
	// options.fields = mergeFields(options.fields, {photo: 0});
	// Currently this is not necessary since we do not preload photos.

	const deps = [patientId, JSON.stringify(Card.projection)];
	const {loading, found, fields} = useCachedPatient(
		{},
		patientId,
		options,
		deps
	);
	const props = {loading, found, patient: {...patient, ...fields}};

	return <Card {...rest} {...props} />;
};

ReactivePatientCard.defaultProps = {
	Card: StaticPatientCard
};

ReactivePatientCard.propTypes = {
	Card: PropTypes.elementType
};

export default ReactivePatientCard;
