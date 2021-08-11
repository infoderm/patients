import faker from 'faker';

import {Documents} from './documents';

export {Documents};

Factory.define('document', Documents, {
	patientId: Factory.get('patient'),
	format: () => faker.company.bs(),
	source: () => faker.lorem.paragraph(),
	parsed: () => false,
});
