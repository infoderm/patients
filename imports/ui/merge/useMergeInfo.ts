import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

import {list} from '@iterable-iterator/list';
import {map} from '@iterable-iterator/map';
import {_chain as chain} from '@iterable-iterator/chain';

import {Patients, patients} from '../../api/patients';
import {Consultations} from '../../api/consultations';
import {Attachments} from '../../api/attachments';
import {Documents} from '../../api/documents';

const useMergeInfo = (toMerge) =>
	useTracker(() => {
		for (const patientId of toMerge) {
			Meteor.subscribe('patient', patientId);
			Meteor.subscribe('patient.consultationsAndAppointments', patientId);
			Meteor.subscribe('patient.attachments', patientId);
			Meteor.subscribe('patient.documents.all', patientId);
		}

		const oldPatients = [];
		const consultations = {};
		const attachments = {};
		const documents = {};
		for (const patientId of toMerge) {
			const patient = Patients.findOne(patientId);
			if (patient === undefined) {
				const error = {
					message: `Cannot merge because patient #${patientId} does not exist in the database.`,
				};
				return {error};
			}

			const consultationsForPatient = Consultations.find(
				{patientId},
				{sort: {datetime: -1}},
			).fetch();
			const attachmentsForPatient = Attachments.find(
				{'meta.attachedToPatients': patientId},
				{sort: {'meta.createdAt': -1}},
			).fetch();
			const documentsForPatient = Documents.find(
				{patientId},
				{sort: {createdAt: -1}},
			).fetch();
			oldPatients.push(patient);
			consultations[patientId] = consultationsForPatient;
			attachments[patientId] = attachmentsForPatient;
			documents[patientId] = documentsForPatient;
		}

		return {
			oldPatients,
			consultations,
			attachments,
			documents,
			newPatient: patients.merge(oldPatients),
			newConsultations: list(
				chain(map((x) => consultations[x] || [], toMerge)),
			),
			newAttachments: list(chain(map((x) => attachments[x] || [], toMerge))),
			newDocuments: list(chain(map((x) => documents[x] || [], toMerge))),
		};
	});

export default useMergeInfo;
