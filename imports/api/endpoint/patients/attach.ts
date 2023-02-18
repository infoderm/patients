import {check} from 'meteor/check';

import {Patients} from '../../collection/patients';
import {Attachments} from '../../collection/attachments';

import type TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';

export default define({
	name: '/patients/attach',
	validate(patientId: string, uploadId: string) {
		check(patientId, String);
		check(uploadId, String);
	},
	async transaction(
		db: TransactionDriver,
		patientId: string,
		uploadId: string,
	) {
		const patient = await db.findOne(Patients, {
			_id: patientId,
			owner: this.userId,
		});
		if (patient === null) {
			throw new Meteor.Error('not-found', 'patient not found');
		}

		const result = await db.updateOne(
			Attachments,
			{_id: uploadId, userId: this.userId},
			{
				$addToSet: {'meta.attachedToPatients': patientId},
			},
		);

		if (result.matchedCount === 0) {
			throw new Meteor.Error('not-found', 'attachment not found');
		}

		if (result.matchedCount >= 2) {
			throw new Error('fatal: more than two attachments matched the same _id');
		}

		return result;
	},
	async simulate(patientId: string, uploadId: string) {
		await Attachments.updateAsync(uploadId, {
			$addToSet: {'meta.attachedToPatients': patientId},
		});
		return undefined;
	},
});
