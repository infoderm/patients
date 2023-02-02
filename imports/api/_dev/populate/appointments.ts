import {faker} from '@faker-js/faker';

import {makeTemplate} from '../../../test/fixtures';

import scheduleAppointment from '../../endpoint/appointments/schedule';
import invoke from '../../endpoint/invoke';

export const newAppointmentFormData = makeTemplate({
	datetime: () => faker.date.past(20),
	duration: () => 1,
	reason: () => faker.lorem.sentence(),
	phone: () => faker.phone.number(),
	patient: {
		firstname: () => faker.name.firstName(),
		lastname: () => faker.name.lastName(),
		_id: () => '?',
	},
});

export const newAppointment = async (invocation, extra?) => {
	const {_id} = await invoke(scheduleAppointment, invocation, [
		newAppointmentFormData(extra),
	]);
	return _id;
};
