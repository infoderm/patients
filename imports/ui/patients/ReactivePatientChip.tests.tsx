import {range} from '@iterable-iterator/range';

import React, {StrictMode} from 'react';
import {render} from '@testing-library/react';

import {assert} from 'chai';

import {client, randomPassword, randomUserId} from '../../_test/fixtures';

import call from '../../api/endpoint/call';
import {newPatientFormData} from '../../api/_dev/populate/patients';
import patientsInsert from '../../api/endpoint/patients/insert';
import createUserWithPassword from '../../api/user/createUserWithPassword';
import loginWithPassword from '../../api/user/loginWithPassword';
import {type Patient} from '../../api/collection/documents';

import ReactivePatientChip from './ReactivePatientChip';

const displayName = ({firstname, lastname}: Patient) =>
	[lastname, firstname].filter(Boolean).join(' ') || 'Unknown';

client(__filename, () => {
	it('should be possible to render many chips concurrently', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPassword(username, password);
		await loginWithPassword(username, password);

		const n = 70;

		const patients: Array<{_id: string; firstname: string; lastname: string}> =
			[];

		for (const _ of range(n)) {
			const fields = newPatientFormData();
			// eslint-disable-next-line no-await-in-loop
			const _id = await call(patientsInsert, fields);
			const {firstname, lastname} = fields;
			patients.push({_id, firstname, lastname});
		}

		// eslint-disable-next-line @typescript-eslint/no-empty-function
		const onClick = () => {};

		const {getAllByRole, findByRole} = render(
			<StrictMode>
				{patients.map(({_id}) => (
					<ReactivePatientChip key={_id} patient={{_id}} onClick={onClick} />
				))}
			</StrictMode>,
		);

		const chips = getAllByRole('button');

		assert.lengthOf(chips, n);

		await Promise.all(
			patients.map(async (patient) =>
				findByRole('button', {name: displayName(patient)}),
			),
		);
	});
});
