import React from 'react';
import PropTypes from 'prop-types';

import ReactiveConsultationCard from './ReactiveConsultationCard';

export default function ConsultationsList({
	items,
	itemProps,
	defaultExpandedFirst
}) {
	return (
		<div>
			{items.map((consultation, i) => (
				<ReactiveConsultationCard
					key={consultation._id}
					consultation={consultation}
					defaultExpanded={i === 0 && defaultExpandedFirst}
					{...itemProps}
				/>
			))}
		</div>
	);
}

ConsultationsList.defaultProps = {
	defaultExpandedFirst: false
};

ConsultationsList.propTypes = {
	items: PropTypes.array.isRequired,
	itemProps: PropTypes.object,
	defaultExpandedFirst: PropTypes.bool
};
