import {list} from '@iterable-iterator/list';
import {map} from '@iterable-iterator/map';
import {_chain as chain} from '@iterable-iterator/chain';

import {Patients} from '../../api/collection/patients';
import {Consultations} from '../../api/collection/consultations';
import {Attachments} from '../../api/collection/attachments';
import {Documents} from '../../api/collection/documents';

import {patients} from '../../api/patients';
import useReactive from '../../api/publication/useReactive';
import subscribe from '../../api/publication/subscribe';
import patientsPub from '../../api/publication/patients/patients';
import consultationsAndAppointments from '../../api/publication/consultationsAndAppointments/find';
import attachmentsPub from '../../api/publication/attachments/attachments';
import documentsPub from '../../api/publication/documents/find';

const useMergeInfo = (toMerge) =>
	useReactive(() => {
		subscribe(patientsPub, {_id: {$in: toMerge}});
		subscribe(consultationsAndAppointments, {patientId: {$in: toMerge}});
		subscribe(documentsPub, {patientId: {$in: toMerge}});
		subscribe(attachmentsPub, {'meta.attachedToPatients': {$in: toMerge}});

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
