import React from 'react';
import tuple from '../../lib/types/tuple';

import SelectOneSetting from './SelectOneSetting';

type Props = {
	className?: string;
};

const AgendaSlotClickSetsInitialTime = ({className}: Props) => {
	const options = tuple('off' as const, 'begin' as const);

	return (
		<SelectOneSetting
			className={className}
			title="Agenda slot click sets initial time"
			label="Which"
			setting="agenda-slot-click-sets-initial-time"
			options={options}
		/>
	);
};

export default AgendaSlotClickSetsInitialTime;
