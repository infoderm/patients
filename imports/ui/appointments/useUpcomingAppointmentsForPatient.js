import startOfToday from 'date-fns/startOfToday';

import {useConsultationsAndAppointments} from '../../api/consultations';

/**
 * useUpcomingAppointmentsForPatient.
 *
 * @param {string} patientId
 * @param {{limit: number}} options
 * @return {{loading: boolean, results: array}}
 */
const useUpcomingAppointmentsForPatient = (patientId, {limit}) => {
	const earlyMorning = startOfToday();

	const query = {
		patientId,
		isDone: false,
		isCancelled: {$ne: true},
		datetime: {
			$gte: earlyMorning,
		},
	};

	const mergedOptions = {
		sort: {
			datetime: 1,
		},
		limit,
		fields: {
			patientId: 1,
			isDone: 1,
			isCancelled: 1,
			datetime: 1,
		},
	};

	const deps = [JSON.stringify(query), limit];

	return useConsultationsAndAppointments(query, mergedOptions, deps);
};

export default useUpcomingAppointmentsForPatient;
