import {Meteor} from 'meteor/meteor';
import {Patients} from '../collection/patients';
import {patients} from '../patients';
import type TransactionDriver from '../transaction/TransactionDriver';

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

async function findBestPatientMatch(db: TransactionDriver, owner, entry) {
	if (entry.patientId) {
		const patient = await db.findOne(Patients, {_id: entry.patientId, owner});
		if (patient === null) {
			throw new Meteor.Error('not-found');
		}

		return entry.patientId;
	}

	const firstTwo = {limit: 2};

	const queries = findBestPatientMatch_queries(entry);

	for (const query of queries) {
		// eslint-disable-next-line no-await-in-loop
		const matches = await db.fetch(Patients, {...query, owner}, firstTwo);
		switch (matches.length) {
			case 0: {
				// If no patient matches
				continue;
			}

			case 1: {
				// If exactly 1 patient matches
				return matches[0]!._id;
			}

			default: {
				// If more than 1 patient matches
				return undefined;
			}
		}
	}

	return undefined;
}

export default async function findBestPatientMatchServerOnly(
	db: TransactionDriver,
	owner,
	entry,
) {
	// This query depends on the entire database being available.
	// Therefore, it cannot be simulated efficiently on the client.
	if (Meteor.isServer) return findBestPatientMatch(db, owner, entry);
	return undefined;
}
