import {Meteor} from 'meteor/meteor';
import {Uploads} from './uploads.js';

export const Attachments = Uploads.collection;

if (Meteor.isServer) {
	Meteor.publish('patient.attachments', function (patientId) {
		const selector = {
			'meta.attachedToPatients': patientId,
			userId: this.userId
		};
		return Attachments.find(selector);
	});
}
