import React, {useState} from 'react';

import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';

import startOfToday from 'date-fns/startOfToday';

import usePatient from '../patients/usePatient';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';
import FixedFab from '../button/FixedFab';

import ConsultationsPager from '../consultations/ConsultationsPager';
import ManageConsultationsForPatientButton from '../consultations/ManageConsultationsForPatientButton';

type Props = {
	readonly patientId: string;
};

const AppointmentsForPatient = ({patientId}: Props) => {
	const [showCancelled, setShowCancelled] = useState(true);
	const [showNoShow, setShowNoShow] = useState(true);

	const {loading, found} = usePatient(
		{},
		{filter: {_id: patientId}, projection: {_id: 1}},
		[patientId],
	);

	if (loading) {
		return <Loading />;
	}

	if (!found) {
		return <NoContent>Patient not found.</NoContent>;
	}

	const $or: Array<{
		isCancelled: boolean | {$in: boolean[]};
		scheduledDatetime?: {$gt: Date};
	}> = [
		{
			isCancelled: {
				$in: [false, null!],
			},
			scheduledDatetime: {
				$gt: startOfToday(), // TODO make reactive?
			},
		},
	];

	const filter = {
		patientId,
		isDone: false,
		$or,
	};

	if (showCancelled) {
		$or.push({
			isCancelled: true,
		});
	}

	if (showNoShow) {
		$or.push({
			isCancelled: {
				$in: [false, null!],
			},
		});
	}

	const sort = {datetime: -1};

	return (
		<>
			<ConsultationsPager
				defaultExpandedFirst
				filter={filter}
				sort={sort}
				perpage={5}
			/>
			<ManageConsultationsForPatientButton
				Button={FixedFab}
				col={4}
				color="primary"
				patientId={patientId}
				tooltip="Ask for directions"
			/>
			<FixedFab
				col={5}
				tooltip={showNoShow ? 'Hide no-shows' : 'Show no-shows'}
				color={showNoShow ? 'primary' : 'default'}
				onClick={() => {
					setShowNoShow(!showNoShow);
				}}
			>
				<PhoneDisabledIcon />
			</FixedFab>
			<FixedFab
				col={6}
				tooltip={
					showCancelled
						? 'Hide cancelled appointments'
						: 'Show cancelled appointments'
				}
				color={showCancelled ? 'primary' : 'default'}
				onClick={() => {
					setShowCancelled(!showCancelled);
				}}
			>
				<AlarmOffIcon />
			</FixedFab>
		</>
	);
};

export default AppointmentsForPatient;
