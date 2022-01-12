import faker from '@faker-js/faker';
import {makeTemplate} from '../../test/fixtures';
import invoke from '../endpoint/invoke';
import insertDocument from '../endpoint/documents/insert';

export const newDocumentFormData = makeTemplate({
	format: () => undefined, // faker.company.bs(),
	array: () =>
		new TextEncoder().encode(`A1\\12345\\${faker.lorem.paragraph()}`),
	// source: () => faker.lorem.paragraph(),
	// parsed: () => false,
});

export const newDocument = async (invocation, extra?) => {
	const [_id] = await invoke(insertDocument, invocation, [
		{...newDocumentFormData(), ...extra},
	]);
	return _id;
};

export {Documents} from './documents';
