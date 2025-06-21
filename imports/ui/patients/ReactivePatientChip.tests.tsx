import {map} from '@iterable-iterator/map';
import {range} from '@iterable-iterator/range';

import React from 'react';

import {assert} from 'chai';

import {render as _render} from '../../_test/react';

import {client, randomPassword, randomUserId} from '../../_test/fixtures';

import call from '../../api/endpoint/call';
import {newPatientFormData} from '../../api/_dev/populate/patients';
import patientsInsert from '../../api/endpoint/patients/insert';
import createUserWithPasswordAndLogin from '../../api/user/createUserWithPasswordAndLogin';
import {type Patient} from '../../api/collection/documents';

import UserThemeProvider from '../UserThemeProvider';

import ReactivePatientChip from './ReactivePatientChip';

const displayName = ({firstname, lastname}: Patient) =>
	[lastname, firstname].filter(Boolean).join(' ') || 'Unknown';

const render = (children: React.ReactNode) =>
	_render(children, {
		wrapper: ({children}: {children: React.ReactNode}) => (
			<UserThemeProvider>{children}</UserThemeProvider>
		),
	});

client(__filename, () => {
	it('should be possible to render many chips concurrently', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const n = 70;

		const patients = await Promise.all(
			map(async () => {
				const fields = newPatientFormData();

				const _id = await call(patientsInsert, fields);
				const {firstname, lastname} = fields;
				return {_id, firstname, lastname};
			}, range(n)),
		);

		// eslint-disable-next-line @typescript-eslint/no-empty-function
		const onClick = () => {};

		const {getAllByRole, findByRole} = render(
			<>
				{patients.map(({_id}) => (
					<ReactivePatientChip key={_id} patient={{_id}} onClick={onClick} />
				))}
			</>,
		);

		const chips = getAllByRole('button');

		assert.lengthOf(chips, n);

		await Promise.all(
			patients.map(async (patient) =>
				findByRole('button', {name: displayName(patient)}, {timeout: 3000}),
			),
		);
	}).timeout(15_000);
});
