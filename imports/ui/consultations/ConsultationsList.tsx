import React from 'react';

import ReactiveConsultationCard from './ReactiveConsultationCard';

interface ConsultationsListProps {
	loading?: boolean;
	items: any[];
	itemProps?: object;
	defaultExpandedFirst?: boolean;
}

const ConsultationsList = ({
	loading = false,
	items,
	itemProps = undefined,
	defaultExpandedFirst = false,
}: ConsultationsListProps) => (
	<div>
		{items.map((consultation, i) => (
			<ReactiveConsultationCard
				key={consultation._id}
				loading={loading}
				consultation={consultation}
				defaultExpanded={i === 0 && defaultExpandedFirst}
				{...itemProps}
			/>
		))}
	</div>
);

export default ConsultationsList;
