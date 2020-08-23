import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

import React from 'react';

import StaticPatientCard from './StaticPatientCard.js';

import {Patients} from '../../api/patients.js';

const ReactivePatientCard = ({patient}) => {
	const patientId = patient._id;

	// The options fields key selects fields whose updates we want to subscribe
	// to. Here we subscribe to everything needed to display a
	// StaticPatientCard.
	const options = {
		fields: {
			...StaticPatientCard.projection
		}
	};
	// We could unsubscribe from the photo fields updates. This would avoid double
	// loading when first loading the photo via a query response, then via this
	// subscription.
	// delete options.fields['photo'];

	const props = useTracker(() => {
		const handle = Meteor.subscribe('patient', patientId, options);
		if (handle.ready()) {
			const upToDate = Patients.findOne(patientId, options);
			if (upToDate) {
				return {
					loading: false,
					found: true,
					patient: {
						...patient,
						...upToDate
					}
				};
			}

			return {
				loading: false,
				found: false,
				patient
			};
		}

		return {loading: true, patient};
	}, [patientId, options]);

	return <StaticPatientCard {...props} />;
};

export default ReactivePatientCard;
