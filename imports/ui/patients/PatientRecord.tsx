import React, {Suspense, lazy} from 'react';

import {styled} from '@mui/material/styles';

import {Route, Routes, useParams} from 'react-router-dom';

import TabJumper from '../navigation/TabJumper';
import NoMatch from '../navigation/NoMatch';
import Loading from '../navigation/Loading';

import {myEncodeURIComponent} from '../../util/uri';

import PatientHeader from './PatientHeader';
import PatientPersonalInformation from './PatientPersonalInformation';

const Root = styled('div')({
	paddingTop: 80,
});

const ConsultationsForPatient = lazy(
	async () => import('../consultations/ConsultationsForPatient'),
);
const PatientHistory = lazy(async () => import('./PatientHistory'));
const AppointmentsForPatient = lazy(
	async () => import('../appointments/AppointmentsForPatient'),
);
const DocumentsForPatientPager = lazy(
	async () => import('../documents/DocumentsForPatientPager'),
);
const AttachmentsForPatient = lazy(
	async () => import('../attachments/AttachmentsForPatient'),
);

const tabs = [
	'information',
	'history',
	'consultations',
	'documents',
	'attachments',
	'appointments',
];

const PatientRecordTabs = () => {
	const params = useParams<{tab?: string}>();
	return (
		<TabJumper
			tabs={tabs}
			current={params.tab ?? tabs[0]}
			toURL={(x) => `${params.tab ? '../' : ''}${myEncodeURIComponent(x)}`}
		/>
	);
};

type Props = {
	readonly patientId: string;
};

const PatientRecord = ({patientId}: Props) => {
	return (
		<Root>
			<PatientHeader patientId={patientId} />
			<Routes>
				<Route index element={<PatientRecordTabs />} />
				<Route path=":tab/*" element={<PatientRecordTabs />} />
			</Routes>
			<Suspense fallback={<Loading />}>
				<Routes>
					<Route
						path="/"
						element={<PatientPersonalInformation patientId={patientId} />}
					/>
					<Route
						path="information/*"
						element={<PatientPersonalInformation patientId={patientId} />}
					/>
					<Route
						path="history/*"
						element={<PatientHistory patientId={patientId} />}
					/>
					<Route
						path="appointments/*"
						element={<AppointmentsForPatient patientId={patientId} />}
					/>
					<Route
						path="consultations/*"
						element={<ConsultationsForPatient patientId={patientId} />}
					/>
					<Route
						path="documents/*"
						element={<DocumentsForPatientPager patientId={patientId} />}
					/>
					<Route
						path="attachments/*"
						element={<AttachmentsForPatient patientId={patientId} />}
					/>
					<Route path="*" element={<NoMatch />} />
				</Routes>
			</Suspense>
		</Root>
	);
};

export default PatientRecord;
