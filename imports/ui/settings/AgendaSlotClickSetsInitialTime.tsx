import React from 'react';

import SelectOneSetting from './SelectOneSetting';

interface Props {
	className?: string;
}

const AgendaSlotClickSetsInitialTime = ({className}: Props) => {
	const options = ['off', 'begin'];

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
