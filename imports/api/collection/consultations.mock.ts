import faker from '@faker-js/faker';

// eslint-disable-next-line import/no-unassigned-import
import './patients.mock';
import {Consultations} from './consultations';

Factory.define('consultation', Consultations, {
	patientId: Factory.get('patient'),
	datetime: () => faker.date.past(20),
	reason: () => faker.lorem.sentence(),
	done: () => faker.lorem.paragraph(),
	todo: () => faker.lorem.paragraph(),
	treatment: () => faker.lorem.sentence(),
	next: () => faker.lorem.sentence(),
	more: () => faker.lorem.paragraph(),

	currency: () => 'EUR',
	price: () => faker.datatype.number(150),
	paid: () => 0,
	book: () => `${faker.datatype.number(100)}`,

	isDone: () => true,
});

export {Consultations} from './consultations';
