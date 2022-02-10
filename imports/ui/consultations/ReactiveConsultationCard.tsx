import React from 'react';
import PropsOf from '../../util/PropsOf';
import useAttachments from '../attachments/useAttachments';

import StaticConsultationCard from './StaticConsultationCard';

type Props = Omit<PropsOf<typeof StaticConsultationCard>, 'attachments'>;

const ReactiveConsultationCard = ({consultation, ...rest}: Props) => {
	const query = {'meta.attachedToConsultations': consultation._id};

	const options = {
		fields: {
			_id: 1,
			'meta.attachedToConsultations': 1,
		},
	};

	const deps = [consultation._id];

	const {results: attachments} = useAttachments(query, options, deps);

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
