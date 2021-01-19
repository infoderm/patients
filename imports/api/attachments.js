import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

import {Patients} from './patients.js';
import {Consultations} from './consultations.js';

const attachments = 'attachments';
export const Attachments = new Mongo.Collection(attachments);

const patientsAttachmentsPublication = 'patients.attachments';

import makeQuery from './makeQuery.js';
export const useAttachments = makeQuery(
	Attachments,
	patientsAttachmentsPublication
);

if (Meteor.isServer) {
	Meteor.publish(patientsAttachmentsPublication, function ({patientId: {$in}}) {
		check($in, [String]);

		const attachedToPatient = new Map();
		const attachedToConsultation = new Map();

		const key = (parentCollection, parentId, attachmentId) =>
			`${parentCollection}-${parentId}-${attachmentId}`;
		const value = (parentCollection, parentId, attachmentId, fields) => ({
			...fields,
			parentCollection,
			parentId,
			attachmentId,
			owner: this.userId
		});

		const add = (parentCollection, parentId, attachments, fields) => {
			for (const attachmentId of attachments)
				addOne(parentCollection, parentId, attachmentId, fields);
		};

		const addOne = (parentCollection, parentId, attachmentId, fields) => {
			this.added(
				attachments,
				key(parentCollection, parentId, attachmentId),
				value(parentCollection, parentId, attachmentId, fields)
			);
		};

		const remove = (parentCollection, parentId, attachments) => {
			for (const attachmentId of attachments)
				removeOne(parentCollection, parentId, attachmentId);
		};

		const removeOne = (parentCollection, parentId, attachmentId) => {
			this.removed(attachments, key(parentCollection, parentId, attachmentId));
		};

		const patientsHandle = Patients.find(
			{_id: {$in}, owner: this.userId},
			{fields: {attachments: 1}}
		).observeChanges({
			added: (_id, {attachments}) => {
				if (attachments) {
					attachedToPatient.set(_id, attachments);
					add('patients', _id, attachments, {patientId: _id, group: Infinity});
				}
			},

			changed: (_id, {attachments}) => {
				if (attachments) {
					remove('patients', _id, attachedToPatient.get(_id) || []);
					attachedToPatient.set(_id, attachments);
					add('patients', _id, attachments, {patientId: _id, group: Infinity});
				}
			},

			removed: (_id) => {
				remove('patients', _id, attachedToPatient.get(_id) || []);
				attachedToPatient.delete(_id);
			}
		});

		const consultationsHandle = Consultations.find(
			{
				patientId: {$in},
				owner: this.userId
			},
			{fields: {attachments: 1, patientId: 1, datetime: 1}}
		).observeChanges({
			added: (_id, {attachments, patientId, datetime}) => {
				if (attachments) {
					attachedToConsultation.set(_id, attachments);
					add('consultations', _id, attachments, {
						patientId,
						group: Number(datetime)
					});
				}
			},

			changed: (_id, {attachments, patientId, datetime}) => {
				if (attachments) {
					remove('consultations', _id, attachedToPatient.get(_id) || []);
					attachedToConsultation.set(_id, attachments);
					add('consultations', _id, attachments, {
						patientId,
						group: Number(datetime)
					});
				}
			},

			removed: (_id) => {
				remove('consultations', _id, attachedToPatient.get(_id) || []);
				attachedToConsultation.delete(_id);
			}
		});

		// Mark the subscription as ready.
		this.ready();

		// Stop observing the cursor when the client unsubscribes. Stopping a
		// subscription automatically takes care of sending the client any `removed`
		// messages.
		this.onStop(() => {
			consultationsHandle.stop();
			patientsHandle.stop();
		});
	});
}
