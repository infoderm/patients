import {useMemo} from 'react';

import {map} from '@iterable-iterator/map';

import {
	Patients,
	type PatientDocument,
	type PatientFields,
} from '../../api/collection/patients';
import {Consultations} from '../../api/collection/consultations';
import {Attachments} from '../../api/collection/attachments';
import {Documents} from '../../api/collection/documents';

import {patients} from '../../api/patients';

import useCursor from '../../api/publication/useCursor';
import useSubscription from '../../api/publication/useSubscription';

import patientsPub from '../../api/publication/patients/patients';
import consultationsPub from '../../api/publication/consultationsAndAppointments/find';
import attachmentsPub from '../../api/publication/attachments/attachments';
import documentsPub from '../../api/publication/documents/find';

import {type ConsultationDocument} from '../../api/collection/consultations';
import {type DocumentDocument} from '../../api/collection/documents';
import {type AttachmentDocument} from '../../api/collection/attachments';

const index = <T>(keys: (item: T) => Iterable<string>, items: Iterable<T>) => {
	const table = {};

	for (const item of items) {
		for (const key of keys(item)) {
			if (table[key] === undefined) {
				table[key] = [];
			}

			table[key].push(item);
		}
	}

	return table;
};

export type MergeInfoError = {
	message: string;
};

export type MergeInfo = {loading: boolean} & (
	| {
			error: MergeInfoError;
			oldPatients: undefined;
			consultations: undefined;
			attachments: undefined;
			documents: undefined;
			newPatient: undefined;
			newConsultations: undefined;
			newAttachments: undefined;
			newDocuments: undefined;
	  }
	| {
			error: undefined;
			oldPatients: PatientDocument[];
			consultations: Record<string, ConsultationDocument[]>;
			attachments: Record<string, AttachmentDocument[]>;
			documents: Record<string, DocumentDocument[]>;
			newPatient: PatientFields;
			newConsultations: ConsultationDocument[];
			newAttachments: AttachmentDocument[];
			newDocuments: DocumentDocument[];
	  }
);

const useMergeInfo = (toMerge: string[]): MergeInfo => {
	const patientsLoading = useSubscription(patientsPub, {
		filter: {
			_id: {$in: toMerge},
		},
	});
	const consultationsLoading = useSubscription(consultationsPub, {
		filter: {
			patientId: {$in: toMerge},
		},
	});
	const documentsLoading = useSubscription(documentsPub, {
		filter: {
			patientId: {$in: toMerge},
		},
	});
	const attachmentsLoading = useSubscription(attachmentsPub, {
		filter: {
			'meta.attachedToPatients': {$in: toMerge},
		},
	});

	const loading =
		patientsLoading() ||
		consultationsLoading() ||
		documentsLoading() ||
		attachmentsLoading();

	const fetchedPatients = useCursor(
		() => Patients.find({_id: {$in: toMerge}}),
		toMerge,
	);

	const newConsultations = useCursor(
		() =>
			Consultations.find({patientId: {$in: toMerge}}, {sort: {datetime: -1}}),
		toMerge,
	);

	const newDocuments = useCursor(
		() => Documents.find({patientId: {$in: toMerge}}, {sort: {createdAt: -1}}),
		toMerge,
	);

	const newAttachments = useCursor(
		() =>
			Attachments.find(
				{'meta.attachedToPatients': {$in: toMerge}},
				{sort: {'meta.createdAt': -1}},
			),
		toMerge,
	);

	const results = useMemo(() => {
		const oldPatients: PatientDocument[] = [];

		const fetchedPatientIndex = new Map<string, PatientDocument>(
			map(
				(patient: PatientDocument) => [patient._id, patient],
				fetchedPatients,
			),
		);

		for (const patientId of toMerge) {
			const patient = fetchedPatientIndex.get(patientId);
			if (patient === undefined) {
				const error = {
					message: `Cannot merge because patient #${patientId} does not exist in the database.`,
				};
				return {error};
			}

			oldPatients.push(patient);
		}

		const consultations = index(
			(consultation) => [consultation.patientId],
			newConsultations,
		);
		const documents = index((document) => [document.patientId!], newDocuments);
		const attachments = index(
			(attachment) => attachment.meta?.attachedToPatients ?? [],
			newAttachments,
		);

		const newPatient = patients.merge(oldPatients);

		return {
			oldPatients,
			consultations,
			documents,
			attachments,
			newPatient,
		};
	}, [
		toMerge,
		fetchedPatients,
		newConsultations,
		newDocuments,
		newAttachments,
	]);

	return {
		loading,
		...results,
		newConsultations,
		newDocuments,
		newAttachments,
	} as MergeInfo;
};

export default useMergeInfo;
