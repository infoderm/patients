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
import patient from '../../api/publication/patients/patient';
import consultationsAndAppointments from '../../api/publication/patient/consultationsAndAppointments';
import attachedToPatient from '../../api/publication/patient/attachments';
import all from '../../api/publication/patient/documents/all';

const useMergeInfo = (toMerge) =>
	useReactive(() => {
		for (const patientId of toMerge) {
			subscribe(patient, patientId);
			subscribe(consultationsAndAppointments, patientId);
			subscribe(attachedToPatient, patientId);
			subscribe(all, patientId);
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
