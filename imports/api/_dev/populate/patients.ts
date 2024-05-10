import {faker} from '@faker-js/faker';

import {list} from '@iterable-iterator/list';
import {map} from '@iterable-iterator/map';
import {range} from '@iterable-iterator/range';

import format from 'date-fns/format';

import {makeTemplate} from '../../../_test/fixtures';

import {BIRTHDATE_FORMAT, SEX_ALLOWED} from '../../collection/patients';

import insertPatient from '../../endpoint/patients/insert';
import invoke from '../../endpoint/invoke';

const AGE_MAX = 130;

export const newPatientFormData = makeTemplate({
	niss: () => faker.string.uuid(),
	firstname: () => faker.person.firstName(),
	lastname: () => faker.person.lastName(),

	birthdate: () => format(faker.date.past({years: AGE_MAX}), BIRTHDATE_FORMAT),
	sex: () => faker.helpers.arrayElement(SEX_ALLOWED),
	photo: () => '', // Could use faker.image.dataUri but this would need to put the format in the database
	// because current database uses PNG by default and dataUri spits out SVG

	antecedents: () => faker.lorem.paragraph(),
	ongoing: () => faker.lorem.paragraph(),
	about: () => faker.lorem.paragraph(),

	municipality: () => faker.location.city(),
	streetandnumber: () => faker.location.streetAddress(),
	zip: () => faker.location.zipCode(),
	phone: () => faker.phone.number(),

	insurances: () =>
		list(
			map(
				() => ({
					displayName: faker.company.name(),
					name: '',
				}),
				range(faker.number.int(2)),
			),
		),
	doctors: () =>
		list(
			map(
				() => ({
					displayName: `${faker.person.lastName()} ${faker.person.firstName()}`,
					name: '',
				}),
				range(faker.number.int(2)),
			),
		),
	allergies: () =>
		list(
			map(
				() => ({
					displayName: faker.commerce.product(),
					name: '',
				}),
				range(faker.number.int(4)),
			),
		),

	noshow: () => faker.number.int(3),
});

export const newPatient = async (invocation, extra?) => {
	return invoke(insertPatient, invocation, [newPatientFormData(extra)]);
};
