import faker from 'faker' ;

import { list } from '@aureooms/js-itertools' ;
import { map } from '@aureooms/js-itertools' ;
import { range } from '@aureooms/js-itertools' ;

import { format } from 'date-fns' ;

import { Consultations } from './consultations.js' ;

export { Consultations } ;

const AGE_MAX = 130 ;

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
	price: () => faker.random.number(150),
	paid: () => 0,
	book: () => `${faker.random.number(100)}`,

});
