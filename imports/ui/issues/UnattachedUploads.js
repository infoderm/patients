import React from 'react';

import useAttachments from '../attachments/useAttachments';
import AttachmentsGrid from '../attachments/AttachmentsGrid';

const UnattachedUploads = (props) => {
	const query = {
		$and: [
			{'meta.attachedToPatients': {$not: {$gt: ''}}},
			{'meta.attachedToConsultations': {$not: {$gt: ''}}}
		]
	};
	const options = {};

	const {loading, results: attachments} = useAttachments(query, options, []);

	if (loading) {
		return <div {...props}>Loading...</div>;
	}

	if (attachments.length === 0) {
		return <div {...props}>All uploads are attached to something :)</div>;
	}

	return (
		<div {...props}>
			<AttachmentsGrid spacing={2} attachments={attachments} />
		</div>
	);
};

export default UnattachedUploads;
