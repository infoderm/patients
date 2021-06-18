import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Uploads} from './uploads';

export const Attachments = Uploads.collection;

export const link = (attachment) =>
	`/${Uploads.link(attachment).split('/').slice(3).join('/')}`;

if (Meteor.isServer) {
	Meteor.publish('attachments', function (query, options) {
		const selector = {
			...query,
			userId: this.userId
		};
		return Attachments.find(selector, options);
	});

	Meteor.publish('attachment', function (_id) {
		check(_id, String);
		return Attachments.find({userId: this.userId, _id});
	});

	Meteor.publish('patient.attachments', function (patientId) {
		const selector = {
			'meta.attachedToPatients': patientId,
			userId: this.userId
		};
		return Attachments.find(selector);
	});
}
