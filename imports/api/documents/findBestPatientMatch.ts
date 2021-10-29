import {Meteor} from 'meteor/meteor';
import {Patients} from '../collection/patients';
import {patients} from '../patients';

function* findBestPatientMatch_queries(entry) {
	if (entry.patient) {
		const {nn, firstname, lastname} = entry.patient;

		if (nn) yield {niss: nn};

		if (firstname && lastname) {
			yield {normalizedName: patients.normalizedName(firstname, lastname)};
			// In case names have been swapped
			yield {normalizedName: patients.normalizedName(lastname, firstname)};
		}
	}
}

function findBestPatientMatch(owner, entry) {
	if (entry.patientId) {
		return entry.patientId;
	}

	const firstTwo = {limit: 2};

	const queries = findBestPatientMatch_queries(entry);

	for (const query of queries) {
		const matches = Patients.find({...query, owner}, firstTwo).fetch();
		switch (matches.length) {
			case 0:
				// If no patient matches
				continue;
			case 1:
				// If exactly 1 patient matches
				return matches[0]._id;
			default:
				// If more than 1 patient matches
				return undefined;
		}
	}

	return undefined;
}

export default function findBestPatientMatchServerOnly(owner, entry) {
	// This query depends on the entire database being available.
	// Therefore, it cannot be simulated efficiently on the client.
	if (Meteor.isServer) return findBestPatientMatch(owner, entry);
	return undefined;
}
