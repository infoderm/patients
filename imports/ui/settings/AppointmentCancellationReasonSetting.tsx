import React from 'react';

import InputManySetting, {type InputManySettingProps} from './InputManySetting';

const KEY = 'appointment-cancellation-reason' as const;

const AppointmentCancellationReasonSetting = (
	props: Omit<
		InputManySettingProps<typeof KEY>,
		'title' | 'label' | 'setting' | 'placeholder' | 'inputTransform'
	>,
) => (
	<InputManySetting
		title="Appointment cancellation reasons"
		label="Reasons"
		setting={KEY}
		placeholder="Give additional reasons (spaces not allowed)"
		inputTransform={(input) => input.toLowerCase().trim()}
		{...props}
	/>
);

export default AppointmentCancellationReasonSetting;
