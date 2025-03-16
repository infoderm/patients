import React from 'react';

import {BrowserRouter} from 'react-router-dom';

import dateFormat from 'date-fns/format';
import startOfYear from 'date-fns/startOfYear';
import subYears from 'date-fns/subYears';

import {client, randomPassword, randomUserId} from '../../_test/fixtures';
import {render as _render} from '../../_test/react';
import createUserWithPasswordAndLogin from '../../api/user/createUserWithPasswordAndLogin';
import insertConsultation from '../../api/endpoint/consultations/insert';
import {newConsultationFormData} from '../../api/_dev/populate/consultations';
import call from '../../api/endpoint/call';

import DateTimeLocalizationProvider from '../i18n/DateTimeLocalizationProvider';

import insertPatient from '../../api/endpoint/patients/insert';
import {newPatientFormData} from '../../api/_dev/populate/patients';

import PaidConsultationsList from './PaidConsultationsList';

const render = (children: React.ReactNode) =>
	_render(children, {
		wrapper: ({children}: {children: React.ReactNode}) => (
			<DateTimeLocalizationProvider>
				<BrowserRouter>{children}</BrowserRouter>
			</DateTimeLocalizationProvider>
		),
	});

client(__filename, () => {
	it('should render when empty', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const now = new Date();
		const currentYear = startOfYear(now);
		const previousYear = subYears(currentYear, 1);

		const {findByRole} = render(
			<PaidConsultationsList
				year={Number.parseInt(dateFormat(currentYear, 'y'), 10)}
			/>,
		);

		await findByRole('link', {name: dateFormat(previousYear, 'y')});
	});

	it('should render paid consultation', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const now = new Date();
		const currentYear = startOfYear(now);

		const {findByRole} = render(
			<PaidConsultationsList
				year={Number.parseInt(dateFormat(currentYear, 'y'), 10)}
			/>,
		);

		const patientFields = newPatientFormData();

		const patientId = await call(insertPatient, patientFields);

		await call(
			insertConsultation,
			newConsultationFormData({
				patientId,
				price: 70,
				paid: 70,
				datetime: now,
			}),
		);

		const {firstname, lastname} = patientFields;

		await findByRole('link', {name: `${lastname} ${firstname}`});
	});
});
