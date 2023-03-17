import useConsultationsAndAppointments from './useConsultationsAndAppointments';

const useConsultationsForPatient = (
	patientId: string,
	{limit}: {limit: number},
) => {
	const query = {
		filter: {
			patientId,
			isDone: true,
		},
		sort: {
			datetime: -1,
		} as const,
		limit,
		projection: {
			patientId: 1,
			isDone: 1,
			datetime: 1,
		} as const,
	};

	const deps = [patientId, limit];

	return useConsultationsAndAppointments(query, deps);
};

export default useConsultationsForPatient;
