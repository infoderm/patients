import React from 'react';

import {patients} from '../../api/patients.js';

import SetPicker from '../input/SetPicker.js';

import PropsOf from '../../util/PropsOf.js';
import ReactivePatientChip from './ReactivePatientChip.js';
import usePatientsSuggestions from './usePatientsSuggestions';

type Props = Omit<
	PropsOf<typeof SetPicker>,
	'itemToKey' | 'itemToString' | 'useSuggestions'
>;

const PatientPicker = ({...rest}: Props) => {
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
