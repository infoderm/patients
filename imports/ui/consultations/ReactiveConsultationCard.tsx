import React from 'react';
import type PropsOf from '../../lib/types/PropsOf';
import useAttachments from '../attachments/useAttachments';

import StaticConsultationCard from './StaticConsultationCard';

type Props = Omit<PropsOf<typeof StaticConsultationCard>, 'attachments'>;

const ReactiveConsultationCard = ({consultation, ...rest}: Props) => {
	const query = {
		filter: {'meta.attachedToConsultations': consultation._id},
		projection: {
			_id: 1,
			'meta.attachedToConsultations': 1,
		} as const,
	};

	const deps = [consultation._id];

	const {results: attachments} = useAttachments(query, deps);

	return (
		<StaticConsultationCard
			consultation={consultation}
			attachments={attachments}
			{...rest}
		/>
	);
};

ReactiveConsultationCard.projection = StaticConsultationCard.projection;

export default ReactiveConsultationCard;
