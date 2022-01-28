import React, {Suspense, lazy} from 'react';

import PropTypes from 'prop-types';

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

const PatientRecord = (props) => {
	const classes = useStyles();

	const {location, patientId, tab, page, perpage} = props;

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
				{!tabs.includes(tab) && <NoMatch location={location} />}
			</Suspense>
		</div>
	);
};

PatientRecord.defaultProps = {
	tab: 'information',
	page: 1,
	perpage: 5,
};

PatientRecord.propTypes = {
	patientId: PropTypes.string.isRequired,
	tab: PropTypes.string,
	page: PropTypes.number,
	perpage: PropTypes.number,
};

export default ({match, location, patientId, tab, page, perpage}) => {
	patientId = patientId || match.params.id;
	tab = tab || match.params.tab || PatientRecord.defaultProps.tab;
	page =
		page ||
		Number.parseInt(match.params.page, 10) ||
		PatientRecord.defaultProps.page;
	perpage = perpage || PatientRecord.defaultProps.perpage;

	return (
		<PatientRecord
			{...{
				location,
				patientId,
				tab,
				page,
				perpage,
			}}
		/>
	);
};
