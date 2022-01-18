import faker from '@faker-js/faker';

import {Appointments} from './appointments';

Factory.define('appointment', Appointments, {
	datetime: () => faker.date.past(20),
	duration: () => 1,
	reason: () => faker.lorem.sentence(),
	phone: () => faker.phone.phoneNumber(),
	patient: {
		firstname: () => faker.name.firstName(),
		lastname: () => faker.name.lastName(),
		_id: () => '?', // DOES NOT WORK
	},
});

// TODO get rid of factory, rely only on Faker and method invocations

export {Appointments} from './appointments';
