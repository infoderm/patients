import faker from '@faker-js/faker';

import {Documents} from './documents';

Factory.define('document', Documents, {
	patientId: Factory.get('patient'),
	format: () => faker.company.bs(),
	source: () => faker.lorem.paragraph(),
	parsed: () => false,
});

export {Documents} from './documents';
