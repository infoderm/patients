import React from 'react';

import ReactiveConsultationCard from './ReactiveConsultationCard';

type ConsultationsListProps = {
	className?: string;
	loading?: boolean;
	items: any[];
	itemProps?: object;
	defaultExpandedFirst?: boolean;
};

const ConsultationsList = ({
	className = undefined,
	loading = false,
	items,
	itemProps = undefined,
	defaultExpandedFirst = false,
}: ConsultationsListProps) => (
	<div className={className}>
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
