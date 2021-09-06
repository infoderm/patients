import {check} from 'meteor/check';

import {Documents} from '../../collection/documents';
import {Patients} from '../../collection/patients';

import define from '../define';

export default define({
	name: 'documents.link',
	validate(documentId: string, patientId: string) {
		check(documentId, String);
		check(patientId, String);
	},
	run(documentId: string, patientId: string) {
		// TODO make atomic
		const document = Documents.findOne(documentId);
		const patient = Patients.findOne(patientId);
		if (!document || document.owner !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own document');
		}

		if (!patient || patient.owner !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own patient');
		}

		return Documents.update(documentId, {$set: {patientId}});
	},
});
