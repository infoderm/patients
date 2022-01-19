import React from 'react';

import {list} from '@iterable-iterator/list';
import {filter} from '@iterable-iterator/filter';

import {msToString, units} from '../../api/duration';

// import {settings} from '../settings/hooks';

import InputManySetting from './InputManySetting';

const durationUnits = units;

const KEY = 'appointment-duration';

export default function AppointmentDurationSetting({className}) {
	return (
		<InputManySetting
			className={className}
			title="Appointment durations"
			label="Durations"
			setting={KEY}
			itemToString={(x) => msToString(x)}
			createNewItem={(x) => Number.parseInt(x, 10) * durationUnits.minute}
			placeholder="Give additional durations in minutes"
			inputTransform={(input) =>
				list(filter((x) => x >= '0' && x <= '9', input)).join('')
			}
		/>
	);
}
