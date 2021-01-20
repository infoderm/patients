import {useConsultationsAndAppointments} from '../../api/consultations.js';
import useAttachments from './useAttachments.js';

const useAttachmentsForPatients = ($in) => {
	const cQuery = {
		patientId: {$in}
	};

	const cOptions = {
		fields: {
			datetime: 1,
			patientId: 1
		}
	};

	const cDeps = $in;

	const {
		loading: loadingConsultations,
		results: consultations
	} = useConsultationsAndAppointments(cQuery, cOptions, cDeps);

	// console.debug({cQuery, cOptions, cDeps, loadingConsultations, consultations});

	const consultationId = {$in: consultations.map((x) => x._id)};

	const query = {
		$or: [
			{'meta.attachedToPatients': {$in}},
			{'meta.attachedToConsultations': consultationId}
		]
	};

	const options = {
		fields: {
			'meta.createdAt': 1,
			'meta.attachedToPatients': 1,
			'meta.attachedToConsultations': 1
		}
	};

	const deps = [JSON.stringify(query)];

	const {loading: loadingAttachments, results: attachments} = useAttachments(
		query,
		options,
		deps
	);

	// console.debug({query, options, deps, loadingAttachments, attachments});

	const patientSet = new Set($in);
	const consultationMap = new Map(consultations.map((x) => [x._id, x]));

	const loading = loadingConsultations || loadingAttachments;
	const results = [];

	for (const {_id, meta} of attachments) {
		if (meta?.attachedToPatients) {
			for (const parentId of meta.attachedToPatients) {
				if (patientSet.has(parentId)) {
					results.push({
						parentCollection: 'patients',
						parentId,
						attachmentId: _id,
						patientId: parentId,
						group: Infinity
					});
				}
			}
		}

		if (meta?.attachedToConsultations) {
			for (const parentId of meta.attachedToConsultations) {
				if (consultationMap.has(parentId)) {
					const {patientId, datetime} = consultationMap.get(parentId);
					results.push({
						parentCollection: 'consultations',
						parentId,
						attachmentId: _id,
						patientId,
						group: Number(datetime)
					});
				}
			}
		}
	}

	results.sort((a, b) => b.group - a.group);

	return {loading, results};
};

export default useAttachmentsForPatients;
