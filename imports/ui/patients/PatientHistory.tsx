import React, {useCallback, useState} from 'react';
import {Link} from 'react-router-dom';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';

import Typography from '@mui/material/Typography';

import AppointmentIcon from '@mui/icons-material/Alarm';
import CancelledAppointmentIcon from '@mui/icons-material/AlarmOff';
import NoShowAppointmentIcon from '@mui/icons-material/PhoneDisabled';

import ConsultationIcon from '@mui/icons-material/SupervisorAccount';
import RemoteConsultationIcon from '@mui/icons-material/LocalPhone';

import LoadMoreIcon from '@mui/icons-material/UnfoldMore';
import LoadMorePendingIcon from '@mui/icons-material/Pending';

import PatientCreatedIcon from '@mui/icons-material/CreateNewFolder';
import PatientDiedIcon from '@mui/icons-material/HeartBroken';
import PatientWasBornIcon from '@mui/icons-material/Celebration';

import parseISO from 'date-fns/parseISO';
import isValid from 'date-fns/isValid';
import {useDateFormat, useDateFormatAge} from '../../i18n/datetime';
import consultationVirtualFields from '../../api/consultations/virtualFields';

import Loading from '../navigation/Loading';

import useImportantStringsDict from '../settings/useImportantStringsDict';
import colorizeText from '../text/colorizeText';

import useConsultationsAndAppointments from '../consultations/useConsultationsAndAppointments';
import patientVirtualFields from '../../api/patients/virtualFields';
import NoContent from '../navigation/NoContent';
import usePatient from './usePatient';

type PatientHistoryProps = {
	patientId: string;
};

const Dot = ({_id, isDone, isCancelled, isNoShow, isRemote}) => {
	const color = isDone
		? 'success'
		: isCancelled
		? 'warning'
		: isNoShow
		? 'error'
		: 'info';
	return (
		<Link to={`/consultation/${_id}`}>
			<TimelineDot color={color}>
				<Icon
					isDone={isDone}
					isCancelled={isCancelled}
					isNoShow={isNoShow}
					isRemote={isRemote}
				/>
			</TimelineDot>
		</Link>
	);
};

const Icon = ({isDone, isCancelled, isNoShow, isRemote}) => {
	if (isDone) {
		if (isRemote) {
			return <RemoteConsultationIcon />;
		}

		return <ConsultationIcon />;
	}

	if (isCancelled) {
		return <CancelledAppointmentIcon />;
	}

	if (isNoShow) {
		return <NoShowAppointmentIcon />;
	}

	return <AppointmentIcon />;
};

const MaybeDeathItem = ({loading, found, patient}) => {
	const dateFormat = useDateFormat();
	const localizeAge = useDateFormatAge();

	if (loading || !found) return null;

	const {birthdate, deathdate, isDead} = patientVirtualFields(patient);

	if (!isDead) return null;

	const displayedAge = localizeAge(birthdate, deathdate);

	return (
		<TimelineItem>
			<TimelineOppositeContent
				sx={{m: 'auto 0'}}
				variant="body2"
				color="text.secondary"
			>
				{dateFormat(deathdate!, 'PPPPpp')}
			</TimelineOppositeContent>
			<TimelineSeparator>
				<TimelineDot>
					<PatientDiedIcon />
				</TimelineDot>
				<TimelineConnector />
			</TimelineSeparator>
			<TimelineContent sx={{py: '-12px', px: 2}}>
				<Typography variant="h6" component="span">
					Patient died
				</Typography>
				<Typography>At the age of {displayedAge}</Typography>
			</TimelineContent>
		</TimelineItem>
	);
};

const PatientWasBornItem = ({patient}) => {
	const localizeBirthdate = useDateFormat('PPP');
	const date = parseISO(patient.birthdate);
	const displayedBirthdate = isValid(date)
		? localizeBirthdate(date)
		: patient.birthdate
		? patient.birthdate
		: 'unknown date';
	return (
		<TimelineItem>
			<TimelineOppositeContent
				sx={{m: 'auto 0'}}
				variant="body2"
				color="text.secondary"
			>
				{displayedBirthdate}
			</TimelineOppositeContent>
			<TimelineSeparator>
				<TimelineConnector />
				<TimelineDot>
					<PatientWasBornIcon />
				</TimelineDot>
			</TimelineSeparator>
			<TimelineContent sx={{py: '18px', px: 2}}>
				<Typography variant="h6" component="span">
					Patient was born
				</Typography>
			</TimelineContent>
		</TimelineItem>
	);
};

const title = (item) => {
	const {isDone, isCancelled} = item;

	const {isNoShow, isRemote} = consultationVirtualFields(item);

	return isDone
		? isRemote
			? 'Consultation par téléphone'
			: 'Consultation'
		: isCancelled
		? 'RDV annulé'
		: isNoShow
		? 'PVPP'
		: 'RDV';
};

const description = (item, importantStringsDict) => {
	return item.reason
		? colorizeText(importantStringsDict, item.reason)
		: item.cancellationExplanation;
};

const ConsultationItem = ({item, dateFormat, importantStringsDict}) => {
	const {isDone, isCancelled} = item;

	const {isNoShow, isRemote} = consultationVirtualFields(item);

	return (
		<TimelineItem>
			<TimelineOppositeContent
				sx={{m: 'auto 0'}}
				align="right"
				variant="body2"
				color="text.secondary"
			>
				{dateFormat(item.datetime, 'PPPPpp')}
			</TimelineOppositeContent>
			<TimelineSeparator>
				<TimelineConnector />
				<Dot
					_id={item._id}
					isDone={isDone}
					isCancelled={isCancelled}
					isNoShow={isNoShow}
					isRemote={isRemote}
				/>
				<TimelineConnector />
			</TimelineSeparator>
			<TimelineContent sx={{py: '12px', px: 2}}>
				<Typography variant="h6" component="span">
					{title(item)}
				</Typography>
				{isCancelled && (
					<Typography>
						{item.cancellationReason}{' '}
						{dateFormat(item.cancellationDatetime, 'PPPPpp')}
						<br />
						Explanation: {item.cancellationExplanation || 'unknown'}
					</Typography>
				)}
				<Typography
					color={isCancelled || isNoShow ? 'text.secondary' : undefined}
					style={{
						whiteSpace: 'pre-wrap',
					}}
				>
					{description(item, importantStringsDict)}
				</Typography>
			</TimelineContent>
		</TimelineItem>
	);
};

const perpage = 5;

const PatientHistory = ({patientId}: PatientHistoryProps) => {
	const {
		loading: loadingPatient,
		found: foundPatient,
		fields: patient,
	} = usePatient(
		{_id: patientId},
		patientId,
		{
			fields: {
				photo: 0,
			},
		},
		[patientId],
	);

	const [limit, setLimit] = useState(perpage);
	const loadMore = useCallback(() => {
		setLimit((previous) => previous + perpage);
	}, [setLimit]);
	const query = {patientId};
	const options = {
		sort: {
			begin: -1,
		},
		limit,
	};
	const deps = [patientId, limit];

	const {loading, results} = useConsultationsAndAppointments(
		query,
		options,
		deps,
	);

	const dateFormat = useDateFormat();
	const importantStringsDict = useImportantStringsDict();

	if (loadingPatient || (loading && results.length === 0)) {
		return <Loading />;
	}

	if (!foundPatient) {
		return <NoContent>Patient not found.</NoContent>;
	}

	return (
		<Timeline>
			<MaybeDeathItem
				loading={loadingPatient}
				found={foundPatient}
				patient={patient}
			/>
			{results.map((item) => (
				<ConsultationItem
					key={item._id}
					item={item}
					dateFormat={dateFormat}
					importantStringsDict={importantStringsDict}
				/>
			))}
			{results.length < limit ? null : (
				<TimelineItem>
					<TimelineOppositeContent />
					<TimelineSeparator>
						<TimelineConnector />
						<TimelineDot
							color="primary"
							style={loading ? undefined : {cursor: 'pointer'}}
							onClick={loading ? undefined : loadMore}
						>
							{loading ? <LoadMorePendingIcon /> : <LoadMoreIcon />}
						</TimelineDot>
						<TimelineConnector />
					</TimelineSeparator>
					<TimelineContent />
				</TimelineItem>
			)}
			<TimelineItem>
				<TimelineOppositeContent
					sx={{m: 'auto 0'}}
					variant="body2"
					color="text.secondary"
				>
					{loadingPatient
						? 'Loading...'
						: dateFormat(patient.createdAt, 'PPPPpp')}
				</TimelineOppositeContent>
				<TimelineSeparator>
					<TimelineConnector />
					<TimelineDot>
						<PatientCreatedIcon />
					</TimelineDot>
					<TimelineConnector />
				</TimelineSeparator>
				<TimelineContent sx={{py: '12px', px: 2}}>
					<Typography variant="h6" component="span">
						Patient created
					</Typography>
				</TimelineContent>
			</TimelineItem>
			<PatientWasBornItem patient={patient} />
		</Timeline>
	);
};

export default PatientHistory;
