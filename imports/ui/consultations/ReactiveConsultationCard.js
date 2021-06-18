import React from 'react';
import useAttachments from '../attachments/useAttachments';

import StaticConsultationCard from './StaticConsultationCard';

const ReactiveConsultationCard = ({consultation, ...rest}) => {
	const query = {'meta.attachedToConsultations': consultation._id};

	const options = {
		fields: {
			_id: 1,
			'meta.attachedToConsultations': 1
		}
	};

	const deps = [consultation._id];

	const {results: attachments} = useAttachments(query, options, deps);

	const props = {
		consultation,
		attachments,
		...rest
	};

	return <StaticConsultationCard {...props} />;
};

ReactiveConsultationCard.projection = StaticConsultationCard.projection;

export default ReactiveConsultationCard;
