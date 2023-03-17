import {faker} from '@faker-js/faker';

import {makeTemplate} from '../../../_test/fixtures';

import insertConsultation from '../../endpoint/consultations/insert';
import invoke from '../../endpoint/invoke';

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
});

export const newConsultation = async (invocation, extra?) => {
	return invoke(insertConsultation, invocation, [
		newConsultationFormData(extra),
	]);
};
