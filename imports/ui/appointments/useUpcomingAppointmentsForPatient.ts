import startOfToday from 'date-fns/startOfToday';

import {type AppointmentDocument} from '../../api/collection/appointments';

import useConsultationsAndAppointments from '../consultations/useConsultationsAndAppointments';

const useUpcomingAppointmentsForPatient = (
	patientId: string,
	{limit}: {limit: number},
) => {
	const earlyMorning = startOfToday();

	const filter = {
		patientId,
		isDone: false,
		isCancelled: {$ne: true},
		datetime: {
			$gte: earlyMorning,
		},
	};

	const query = {
		filter,
		sort: {
			datetime: 1,
		} as const,
		limit,
		projection: {
			patientId: 1,
			isDone: 1,
			isCancelled: 1,
			datetime: 1,
		} as const,
	};

	const deps = [JSON.stringify(filter), limit];

	return useConsultationsAndAppointments(query, deps) as {
		loading: boolean;
		results: AppointmentDocument[];
	};
};

export default useUpcomingAppointmentsForPatient;
