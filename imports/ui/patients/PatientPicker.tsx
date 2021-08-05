import React from 'react';

import {patients} from '../../api/patients';

import SetPicker from '../input/SetPicker';

import PropsOf from '../../util/PropsOf';
import Optional from '../../util/Optional';
import ReactivePatientChip from './ReactivePatientChip';
import usePatientsSuggestions from './usePatientsSuggestions';

type Props = Optional<
	PropsOf<typeof SetPicker>,
	'itemToKey' | 'itemToString' | 'useSuggestions'
>;

const PatientPicker = ({...rest}: Props) => (
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

export default PatientPicker;
