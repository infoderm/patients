import {faker} from '@faker-js/faker';

import format from 'date-fns/format';

import {makeTemplate} from '../../../_test/fixtures';

const DATE_FORMAT = 'yyyyMMdd';
const AGE_MAX = 130;

export const newEidData = makeTemplate({
	xml: {
		// eslint-disable-next-line unicorn/text-encoding-identifier-case
		encoding: () => 'UTF-8',
		version: () => '1.0',
	},
	eid: {
		graphpersoversion: () => faker.string.numeric(2),
		version: () => faker.string.numeric(2),
	},
	card: {
		carddata_appl_version: () => faker.string.numeric(2),
		cardnumber: () => faker.string.numeric(12),
		chipnumber: () => faker.string.alphanumeric(32),
		documenttype: () => 'belgian_citizen',
		validitydatebegin: () => format(faker.date.past({years: 30}), DATE_FORMAT),
		validitydateend: () => format(faker.date.past({years: 30}), DATE_FORMAT),
		deliverymunicipality: () => faker.location.county(),
	},
	certificates: {
		authentication: () => faker.string.uuid(),
		citizenca: () => faker.string.uuid(),
		root: () => faker.string.uuid(),
		rrn: () => faker.string.uuid(),
		signing: () => faker.string.uuid(),
	},
	identity: {
		nationality: () => faker.location.country(),
		nationalnumber: () => faker.string.uuid(),
		dateofbirth: () => format(faker.date.past({years: AGE_MAX}), DATE_FORMAT),
		placeofbirth: () => faker.location.city(),
		gender: () => faker.helpers.arrayElement(['male', 'female', undefined]),
		specialstatus: () => faker.word.adjective(),
		name: () => faker.person.lastName(),
		firstname: () => faker.person.firstName(),
		middlenames: () => faker.person.middleName(),
		photo: () => undefined,
	},
	address: {
		municipality: () => faker.location.city(),
		streetandnumber: () => faker.location.streetAddress(),
		zip: () => faker.location.zipCode(),
	},
});
