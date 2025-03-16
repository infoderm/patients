import React from 'react';

import {BrowserRouter} from 'react-router-dom';

import {client, randomPassword, randomUserId} from '../../_test/fixtures';
import {render as _render} from '../../_test/react';
import createUserWithPasswordAndLogin from '../../api/user/createUserWithPasswordAndLogin';

import {newConsultationFormData} from '../../api/_dev/populate/consultations';
import DateTimeLocalizationProvider from '../i18n/DateTimeLocalizationProvider';

import ConsultationEditor from './ConsultationEditor';

const render = (children: React.ReactNode) =>
	_render(children, {
		wrapper: ({children}: {children: React.ReactNode}) => (
			<DateTimeLocalizationProvider>
				<BrowserRouter>{children}</BrowserRouter>
			</DateTimeLocalizationProvider>
		),
	});

client(__filename, () => {
	it('should render when loading', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const {findByRole} = render(
			<ConsultationEditor loading found={false} consultation={undefined} />,
		);

		await findByRole('generic', {name: 'loading'});
	});

	it('should render if not found', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const {findByRole} = render(
			<ConsultationEditor
				loading={false}
				found={false}
				consultation={undefined}
			/>,
		);

		await findByRole('heading', {name: 'Consultation not found.'});
	});

	it('should render loading state before beginning consultation', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const consultation = {
			...newConsultationFormData(),
		};

		const {findByRole} = render(
			<ConsultationEditor found loading={false} consultation={consultation} />,
		);

		await findByRole('generic', {name: 'loading'});
	});

	it('should render when loaded and found', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const consultation = {
			...newConsultationFormData(),
			isDone: true,
		};

		const {findByRole} = render(
			<ConsultationEditor found loading={false} consultation={consultation} />,
		);

		await findByRole('textbox', {name: 'Motif de la visite'});
	});
});
