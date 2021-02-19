import React, {useState} from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';

import startOfToday from 'date-fns/startOfToday';

import usePatient from '../patients/usePatient.js';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';
import {computeFixedFabStyle} from '../button/FixedFab.js';

import ConsultationsPager from '../consultations/ConsultationsPager.js';

const useStyles = makeStyles((theme) => ({
	noShowToggle: computeFixedFabStyle({theme, col: 4}),
	cancelledToggle: computeFixedFabStyle({theme, col: 5})
}));

const ConsultationsForPatient = (props) => {
	const classes = useStyles();

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
			<Fab
				className={classes.noShowToggle}
				color={showNoShow ? 'primary' : 'default'}
				onClick={() => setShowNoShow(!showNoShow)}
			>
				<PhoneDisabledIcon />
			</Fab>
			<Fab
				className={classes.cancelledToggle}
				color={showCancelled ? 'primary' : 'default'}
				onClick={() => setShowCancelled(!showCancelled)}
			>
				<AlarmOffIcon />
			</Fab>
		</>
	);
};

export default ConsultationsForPatient;
