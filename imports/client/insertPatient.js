import {Meteor} from 'meteor/meteor';

import {Patients} from '../api/patients.js';

import eidParseXML from '../api/eidParseXML.js';

export default function insertPatient(history, xmlString) {
	const op = eidParseXML(xmlString);

	const query = {niss: op.niss};
	const options = {fields: {_id: 1, niss: 1}};
	Meteor.subscribe('patients', query, options, {
		onReady: () => {
			const patient = Patients.findOne(query, options);
			if (patient) {
				Meteor.call('patients.update', patient._id, op, (err, _res) => {
					if (err) {
						console.error(err);
					} else {
						history.push({pathname: `/patient/${patient._id}`});
					}
				});
			} else {
				Meteor.call('patients.insert', op, (err, _id) => {
					if (err) {
						console.error(err);
					} else {
						history.push({pathname: `/patient/${_id}`});
					}
				});
			}
		},
		onStop: (err) => console.error(err)
	});
}
