import React from 'react';

import {patients} from '../../api/patients.js';

import SetPicker from '../input/SetPicker.js';

import ReactivePatientChip from './ReactivePatientChip.js';
import usePatientsSuggestions from './usePatientsSuggestions';

const PatientPicker = ({...rest}) => {
	return (
		<SetPicker
			Chip={ReactivePatientChip}
			chipProps={(patient) => ({patient})}
			itemToKey={patients.toKey}
			itemToString={patients.toString}
			useSuggestions={usePatientsSuggestions}
			maxCount={1}
			{...rest}
		/>
	);
};

export default PatientPicker;
