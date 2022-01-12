import faker from '@faker-js/faker';
import {makeTemplate} from '../../test/fixtures';
import invoke from '../endpoint/invoke';

import insertConsultation from '../endpoint/consultations/insert';

export const newConsultationFormData = makeTemplate({
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

export const newConsultation = async (invocation, extra?) => {
	return invoke(insertConsultation, invocation, [
		{...newConsultationFormData(), ...extra},
	]);
};

export {Consultations} from './consultations';
