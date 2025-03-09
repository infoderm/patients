import {faker} from '@faker-js/faker';

import {makeTemplate} from '../../../_test/fixtures';

import scheduleAppointment from '../../endpoint/appointments/schedule';
import invoke from '../../endpoint/invoke';

export const newAppointmentFormData = makeTemplate({
	datetime: () => faker.date.past({years: 20}),
	duration: () => 1,
	reason: () => faker.lorem.sentence(),
	phone: () => faker.phone.number(),
	patient: {
		firstname: () => faker.person.firstName(),
		lastname: () => faker.person.lastName(),
		_id: () => '?',
	},
});

export const newAppointment = async (invocation, extra?) => {
	const {_id} = await invoke(scheduleAppointment, invocation, [
		newAppointmentFormData(extra),
	]);
	return _id;
};
