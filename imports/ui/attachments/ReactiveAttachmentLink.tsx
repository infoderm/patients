import React from 'react';

import useAttachment from './useAttachment';
import StaticAttachmentLink from './StaticAttachmentLink';

const ReactiveAttachmentLink = ({attachmentId, ...rest}) => {
	const _id = attachmentId;
	const {loading, found, fields} = useAttachment({_id}, _id, undefined, [_id]);
	return (
		<StaticAttachmentLink
			attachmentId={attachmentId}
			loading={loading}
			found={found}
			attachment={fields}
			{...rest}
		/>
	);
};

export default ReactiveAttachmentLink;
