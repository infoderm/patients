import React, {useState} from 'react';

import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';

import startOfToday from 'date-fns/startOfToday';

import usePatient from '../patients/usePatient.js';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';
import FixedFab from '../button/FixedFab.js';

import ConsultationsPager from '../consultations/ConsultationsPager.js';

const ConsultationsForPatient = (props) => {
	const [showCancelled, setShowCancelled] = useState(false);
	const [showNoShow, setShowNoShow] = useState(false);

	const {patientId, page, perpage} = props;

	const options = {fields: {_id: 1}};

	const deps = [patientId];

	const {loading, found} = usePatient({}, patientId, options, deps);

	if (loading) {
		return <Loading />;
	}

	if (!found) {
		return <NoContent>Patient not found.</NoContent>;
	}

	const $or = [
		{
			isCancelled: {
				$in: [false, null]
			},
			scheduledDatetime: {
				$gt: startOfToday() // TODO make reactive?
			}
		}
	];

	const query = {
		patientId,
		isDone: false,
		$or
	};

	if (showCancelled) {
		$or.push({
			isCancelled: true
		});
	}

	if (showNoShow) {
		$or.push({
			isCancelled: {
				$in: [false, null]
			}
		});
	}

	const sort = {datetime: 1};

	return (
		<>
			<ConsultationsPager
				root={`/patient/${patientId}/appointments`}
				page={page}
				perpage={perpage}
				query={query}
				sort={sort}
				defaultExpandedFirst={page === 1}
			/>
			<FixedFab
				col={4}
				tooltip={showNoShow ? 'Hide no-shows' : 'Show no-shows'}
				color={showNoShow ? 'primary' : 'default'}
				onClick={() => setShowNoShow(!showNoShow)}
			>
				<PhoneDisabledIcon />
			</FixedFab>
			<FixedFab
				col={5}
				tooltip={
					showCancelled
						? 'Hide cancelled appointments'
						: 'Show cancelled appointments'
				}
				color={showCancelled ? 'primary' : 'default'}
				onClick={() => setShowCancelled(!showCancelled)}
			>
				<AlarmOffIcon />
			</FixedFab>
		</>
	);
};

export default ConsultationsForPatient;
