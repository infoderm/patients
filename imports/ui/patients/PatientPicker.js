import React from 'react';

import {patients} from '../../api/patients.js';

import SetPicker from '../input/SetPicker.js';

import usePatientsSuggestions from './usePatientsSuggestions';

const PatientPicker = ({...rest}) => {
	return (
		<SetPicker
			itemToKey={patients.toKey}
			itemToString={patients.toString}
			useSuggestions={usePatientsSuggestions}
			maxCount={1}
			{...rest}
		/>
	);
};

export default PatientPicker;
