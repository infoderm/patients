import {faker} from '@faker-js/faker';

import {makeTemplate} from '../../../_test/fixtures';

import invoke from '../../endpoint/invoke';

export const newConsultationFormData = makeTemplate({
	datetime: () => faker.date.past({years: 20}),
	reason: () => faker.lorem.sentence(),
	done: () => faker.lorem.paragraph(),
	todo: () => faker.lorem.paragraph(),
	treatment: () => faker.lorem.sentence(),
	next: () => faker.lorem.sentence(),
	more: () => faker.lorem.paragraph(),

	currency: () => 'EUR',
	price: () => faker.number.int(150),
	paid: () => 0,
	book: () => `${faker.number.int(100)}`,
});

export const newConsultation = async (invocation, extra?) => {
	const {default: insertConsultation} = await import('../../endpoint/consultations/insert');
	return invoke(insertConsultation, invocation, [
		newConsultationFormData(extra),
	]);
};
