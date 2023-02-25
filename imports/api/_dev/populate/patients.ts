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
	niss: () => faker.datatype.uuid(),
	firstname: () => faker.name.firstName(),
	lastname: () => faker.name.lastName(),

	birthdate: () => format(faker.date.past(AGE_MAX), BIRTHDATE_FORMAT),
	sex: () => faker.helpers.arrayElement(SEX_ALLOWED),
	photo: () => '', // Could use faker.image.dataUri but this would need to put the format in the database
	// because current database uses PNG by default and dataUri spits out SVG

	antecedents: () => faker.lorem.paragraph(),
	ongoing: () => faker.lorem.paragraph(),
	about: () => faker.lorem.paragraph(),

	municipality: () => faker.address.city(),
	streetandnumber: () => faker.address.streetAddress(),
	zip: () => faker.address.zipCode(),
	phone: () => faker.phone.number(),

	insurances: () =>
		list(
			map(
				() => ({
					displayName: faker.company.name(),
					name: '',
				}),
				range(faker.datatype.number(2)),
			),
		),
	doctors: () =>
		list(
			map(
				() => ({
					displayName: `${faker.name.lastName()} ${faker.name.firstName()}`,
					name: '',
				}),
				range(faker.datatype.number(2)),
			),
		),
	allergies: () =>
		list(
			map(
				() => ({
					displayName: faker.commerce.product(),
					name: '',
				}),
				range(faker.datatype.number(4)),
			),
		),

	noshow: () => faker.datatype.number(3),
});

export const newPatient = async (invocation, extra?) => {
	return invoke(insertPatient, invocation, [newPatientFormData(extra)]);
};
