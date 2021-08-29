import {key} from '@total-order/key';
import {decreasing} from '@total-order/primitive';
import {iterable} from '@total-order/iter';

import useConsultationsAndAppointments from '../consultations/useConsultationsAndAppointments';
import useAttachments from './useAttachments';
import AttachmentInfo from './AttachmentInfo';

const order = key(iterable(decreasing), function* (x: AttachmentInfo) {
	yield x.group;
	yield x.lastModified;
	yield x.createdAt;
});

const useAttachmentsForPatients = ($in) => {
	const cQuery = {
		patientId: {$in},
	};

	const cOptions = {
		fields: {
			datetime: 1,
			patientId: 1,
		},
	};

	const cDeps = $in;

	const {loading: loadingConsultations, results: consultations} =
		useConsultationsAndAppointments(cQuery, cOptions, cDeps);

	// console.debug({cQuery, cOptions, cDeps, loadingConsultations, consultations});

	const consultationId = {$in: consultations.map((x) => x._id)};

	const query = {
		$or: [
			{'meta.attachedToPatients': {$in}},
			{'meta.attachedToConsultations': consultationId},
		],
	};

	const options = {
		fields: {
			meta: 1,
			// The following does not work because subsequent subscriptions
			// will not fetch additional meta subdocument fields.
			// 'meta.attachedToPatients': 1,
			// 'meta.attachedToConsultations': 1
			// 'meta.lastModified': 1,
			// 'meta.createdAt': 1
		},
	};

	const deps = [JSON.stringify(query)];

	const {loading: loadingAttachments, results: attachments} = useAttachments(
		query,
		options,
		deps,
	);

	// console.debug({query, options, deps, loadingAttachments, attachments});

	const patientSet = new Set($in);
	const consultationMap = new Map(consultations.map((x) => [x._id, x]));

	const loading = loadingConsultations || loadingAttachments;
	const results: AttachmentInfo[] = [];

	for (const {_id, meta} of attachments) {
		if (meta?.attachedToPatients) {
			for (const parentId of meta.attachedToPatients) {
				if (patientSet.has(parentId)) {
					results.push({
						parentCollection: 'patients',
						parentId,
						attachmentId: _id,
						patientId: parentId,
						group: Number.POSITIVE_INFINITY,
						lastModified: Number(meta.lastModified),
						createdAt: Number(meta.createdAt),
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
						group: Number(datetime),
						lastModified: Number(meta.lastModified),
						createdAt: Number(meta.createdAt),
					});
				}
			}
		}
	}

	results.sort(order);

	return {loading, results};
};

export default useAttachmentsForPatients;
