import React, {Suspense, lazy} from 'react';

import {makeStyles} from '@material-ui/core/styles';

import TabJumper from '../navigation/TabJumper';
import NoMatch from '../navigation/NoMatch';
import Loading from '../navigation/Loading';

import PatientHeader from './PatientHeader';
import PatientPersonalInformation from './PatientPersonalInformation';

const ConsultationsForPatient = lazy(
	async () => import('../consultations/ConsultationsForPatient'),
);
const AppointmentsForPatient = lazy(
	async () => import('../appointments/AppointmentsForPatient'),
);
const DocumentsForPatient = lazy(
	async () => import('../documents/DocumentsForPatient'),
);
const AttachmentsForPatient = lazy(
	async () => import('../attachments/AttachmentsForPatient'),
);

const useStyles = makeStyles((theme) => ({
	root: {
		paddingTop: 80,
	},
	container: {
		padding: theme.spacing(3),
	},
}));

interface Props {
	patientId: string;
	tab?: string;
	page?: number;
	perpage?: number;
}

const PatientRecord = ({
	patientId,
	tab = 'information',
	page = 1,
	perpage = 5,
}: Props) => {
	const classes = useStyles();

	const tabs = [
		'information',
		'consultations',
		'documents',
		'attachments',
		'appointments',
	];

	return (
		<div className={classes.root}>
			<PatientHeader patientId={patientId} />
			<TabJumper
				tabs={tabs}
				current={tab}
				toURL={(tab) => `/patient/${patientId}/${tab}`}
			/>
			<Suspense fallback={<Loading />}>
				{tab === 'information' && (
					<PatientPersonalInformation patientId={patientId} />
				)}
				{tab === 'appointments' && (
					<AppointmentsForPatient
						className={classes.container}
						patientId={patientId}
						page={page}
						perpage={perpage}
					/>
				)}
				{tab === 'consultations' && (
					<ConsultationsForPatient
						className={classes.container}
						patientId={patientId}
						page={page}
						perpage={perpage}
					/>
				)}
				{tab === 'documents' && (
					<DocumentsForPatient
						className={classes.container}
						patientId={patientId}
						page={page}
						perpage={perpage}
					/>
				)}
				{tab === 'attachments' && (
					<AttachmentsForPatient
						className={classes.container}
						patientId={patientId}
						page={page}
						perpage={perpage}
					/>
				)}
				{!tabs.includes(tab) && <NoMatch />}
			</Suspense>
		</div>
	);
};

export default PatientRecord;
