import {faker} from '@faker-js/faker';

import {makeTemplate} from '../../../_test/fixtures';

import {allergies} from '../../allergies';
import executeTransaction from '../../transaction/executeTransaction';

export const newAllergyData = makeTemplate(() =>
	faker.commerce.productMaterial(),
);

export const newAllergy = async (invocation, extra?) => {
	return executeTransaction(async (db) => {
		return allergies.add(db, invocation.userId, newAllergyData(extra));
	});
};
