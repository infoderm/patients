import React from 'react';

import schedule from '../../api/endpoint/appointments/schedule';

import type PropsOf from '../../util/types/PropsOf';
import useCall from '../action/useCall';

import AppointmentDialog from './AppointmentDialog';
import AppointmentFromPatientIdDialog from './AppointmentFromPatientIdDialog';

type IgnoredProps = 'onSubmit' | 'pending';

type Props =
	| Omit<PropsOf<typeof AppointmentDialog>, IgnoredProps>
	// eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
	| Omit<PropsOf<typeof AppointmentFromPatientIdDialog>, IgnoredProps>;

const NewAppointmentDialog = (props: Props) => {
	const [call, {pending}] = useCall();
	const onSubmit = async (args) => {
		console.debug('onSubmit', args);
		return call(schedule, args);
	};

	return 'patientId' in props && props.patientId !== undefined ? (
		<AppointmentFromPatientIdDialog
			pending={pending}
			onSubmit={onSubmit}
			{...props}
		/>
	) : (
		<AppointmentDialog pending={pending} onSubmit={onSubmit} {...props} />
	);
};

export default NewAppointmentDialog;
