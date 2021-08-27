import {check} from 'meteor/check';

import {Patients} from '../../patients';
import {Attachments} from '../../attachments';

import executeTransaction from '../../transaction/executeTransaction';

import define from '../define';

export default define({
	name: '/patients/attach',
	validate(patientId: string, uploadId: string) {
		check(patientId, String);
		check(uploadId, String);
	},
	async run(patientId: string, uploadId: string) {
		return executeTransaction(async (session) => {
			const patient = await Patients.rawCollection().findOne(
				{_id: patientId, owner: this.userId},
				{session},
			);
			if (!patient) {
				throw new Meteor.Error('not-found', 'patient not found');
			}

			const result = await Attachments.rawCollection().updateOne(
				{_id: uploadId, userId: this.userId},
				{
					$addToSet: {'meta.attachedToPatients': patientId},
				},
				{session},
			);

			if (result.matchedCount === 0) {
				throw new Meteor.Error('not-found', 'attachment not found');
			}

			if (result.matchedCount >= 2) {
				throw new Error(
					'fatal: more than two attachments matched the same _id',
				);
			}

			return result;
		});
	},
	simulate(patientId: string, uploadId: string) {
		return Attachments.update(uploadId, {
			$addToSet: {'meta.attachedToPatients': patientId},
		});
	},
});
