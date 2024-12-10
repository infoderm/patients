import {useMemo} from 'react';

import {map} from '@iterable-iterator/map';

import {
	Patients,
	type PatientDocument,
	type PatientFields,
} from '../../api/collection/patients';
import {
	Consultations,
	type ConsultationDocument,
} from '../../api/collection/consultations';
import {
	Attachments,
	type AttachmentDocument,
} from '../../api/collection/attachments';
import {Documents, type DocumentDocument} from '../../api/collection/documents';

import {patients} from '../../api/patients';

import useCursor from '../../api/publication/useCursor';
import useSubscription from '../../api/publication/useSubscription';

import patientsPub from '../../api/publication/patients/patients';
import consultationsPub from '../../api/publication/consultationsAndAppointments/find';
import attachmentsPub from '../../api/publication/attachments/attachments';
import documentsPub from '../../api/publication/documents/find';

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
	const loadingPatientsSubscription = useSubscription(patientsPub, {
		filter: {
			_id: {$in: toMerge},
		},
	});
	const loadingConsultationsSubscription = useSubscription(consultationsPub, {
		filter: {
			patientId: {$in: toMerge},
		},
	});
	const loadingDocumentsSubscription = useSubscription(documentsPub, {
		filter: {
			patientId: {$in: toMerge},
		},
	});
	const loadingAttachmentsSubscription = useSubscription(attachmentsPub, {
		filter: {
			'meta.attachedToPatients': {$in: toMerge},
		},
	});

	const {loading: loadingPatientsResults, results: fetchedPatients} = useCursor(
		() => Patients.find({_id: {$in: toMerge}}),
		toMerge,
	);

	const {loading: loadingConsultationsResults, results: newConsultations} =
		useCursor(
			() =>
				Consultations.find({patientId: {$in: toMerge}}, {sort: {datetime: -1}}),
			toMerge,
		);

	const {loading: loadingDocumentsResults, results: newDocuments} = useCursor(
		() => Documents.find({patientId: {$in: toMerge}}, {sort: {createdAt: -1}}),
		toMerge,
	);

	const {loading: loadingAttachmentsResuts, results: newAttachments} =
		useCursor(
			() =>
				Attachments.find(
					{'meta.attachedToPatients': {$in: toMerge}},
					{sort: {'meta.createdAt': -1}},
				),
			toMerge,
		);

	const loading =
		loadingPatientsSubscription() ||
		loadingPatientsResults ||
		loadingConsultationsSubscription() ||
		loadingConsultationsResults ||
		loadingDocumentsSubscription() ||
		loadingDocumentsResults ||
		loadingAttachmentsSubscription() ||
		loadingAttachmentsResuts;

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
