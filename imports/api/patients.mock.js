import faker from 'faker';

import {list} from '@iterable-iterator/list';
import {map} from '@iterable-iterator/map';
import {range} from '@iterable-iterator/range';

import format from 'date-fns/format';

import {
	Patients,
	patients,
	PatientDocument,
	PatientFields,
	BIRTHDATE_FORMAT,
	SEX_ALLOWED
} from './patients';

export {Patients, patients, PatientDocument, PatientFields};

const AGE_MAX = 130;

Factory.define('patient', Patients, {
	niss: () => faker.random.uuid(),
	firstname: () => faker.name.firstName(),
	lastname: () => faker.name.lastName(),

	birthdate: () => format(faker.date.past(AGE_MAX), BIRTHDATE_FORMAT),
	sex: () => faker.random.arrayElement(SEX_ALLOWED),
	photo: () => '', // Could use faker.image.dataUri but this would need to put the format in the database
	// because current database uses PNG by default and dataUri spits out SVG

	antecedents: () => faker.lorem.paragraph(),
	ongoing: () => faker.lorem.paragraph(),
	about: () => faker.lorem.paragraph(),

	municipality: () => faker.address.city(),
	streetandnumber: () => faker.address.streetAddress(),
	zip: () => faker.address.zipCode(),
	phone: () => faker.phone.phoneNumber(),

	insurances: () =>
		list(map(() => faker.company.companyName(), range(faker.random.number(2)))),
	doctors: () =>
		list(
			map(
				() => `${faker.name.lastName()} ${faker.name.firstName()}`,
				range(faker.random.number(2))
			)
		),
	allergies: () =>
		list(map(() => faker.commerce.product(), range(faker.random.number(4)))),

	noshow: () => faker.random.number(3)
});
