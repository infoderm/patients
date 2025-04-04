import {Patients} from '../../collection/patients';
import {PatientsSearchIndex} from '../../collection/patients/search';
import {Consultations} from '../../collection/consultations';
import {Documents} from '../../collection/documents';
import {Attachments} from '../../collection/attachments';

import define from '../define';
import {availability} from '../../availability';
import type TransactionDriver from '../../transaction/TransactionDriver';
import {AuthenticationLoggedIn} from '../../Authentication';
import schema from '../../../util/schema';

export default define({
	name: '/api/patients/remove',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string()]),
	async transaction(db: TransactionDriver, patientId) {
		const owner = this.userId;
		const patient = await db.findOne(Patients, {_id: patientId, owner});
		if (patient === null) {
			throw new Meteor.Error('not-found');
		}

		const consultationQuery = {owner: this.userId, patientId};
		const removedConsultations = await db.fetch(
			Consultations,
			consultationQuery,
			{
				fields: {_id: 1, begin: 1, end: 1, isDone: 1, isCancelled: 1},
			},
		);
		const consultationIds = removedConsultations.map((x) => x._id);
		const {deletedCount: nConsultationRemoved} = await db.deleteMany(
			Consultations,
			consultationQuery,
		);

		for (const {begin, end, isDone, isCancelled} of removedConsultations) {
			// eslint-disable-next-line no-await-in-loop
			await availability.removeHook(
				db,
				owner,
				begin,
				end,
				isDone || isCancelled ? 0 : 1,
			);
		}

		if (consultationIds.length !== nConsultationRemoved) {
			console.warn(
				`Removed ${nConsultationRemoved} consultations while removing patient #${patientId} but ${
					consultationIds.length
				} where found before (${JSON.stringify(consultationIds)})`,
			);
		}

		await db.updateMany(
			Documents,
			{
				owner: this.userId,
				patientId,
			},
			{
				$set: {
					deleted: true,
				},
			},
		);

		await db.updateMany(
			Attachments,
			{
				userId: this.userId,
				'meta.attachedToPatients': patientId,
			},
			{
				$pull: {'meta.attachedToPatients': patientId},
			},
		);

		await db.updateMany(
			Attachments,
			{
				userId: this.userId,
				'meta.attachedToConsultations': {$in: consultationIds},
			},
			{
				$pullAll: {'meta.attachedToConsultations': consultationIds},
			},
		);

		await db.deleteOne(PatientsSearchIndex, {_id: patientId});
		return db.deleteOne(Patients, {_id: patientId});
	},
	async simulate(patientId: string) {
		await Patients.removeAsync(patientId);
		return undefined;
	},
});
