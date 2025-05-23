import React from 'react';

import tuple from '../../util/types/tuple';

import SelectOneSetting from './SelectOneSetting';

type Props = {
	readonly className?: string;
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
