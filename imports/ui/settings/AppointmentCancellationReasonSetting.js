import React from 'react';

import InputManySetting from './InputManySetting.js';

const KEY = 'appointment-cancellation-reason';

const AppointmentCancellationReasonSetting = (props) => (
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
