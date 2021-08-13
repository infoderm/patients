import useConsultationsAndAppointments from './useConsultationsAndAppointments';

/**
 * useConsultationsForPatient.
 *
 * @param {string} patientId
 * @param {{limit: number}} options
 * @return {{loading: boolean, results: array}}
 */
const useConsultationsForPatient = (patientId, {limit}) => {
	const query = {
		patientId,
		isDone: true,
	};

	const options = {
		sort: {
			datetime: -1,
		},
		limit,
		fields: {
			patientId: 1,
			isDone: 1,
			datetime: 1,
		},
	};

	const deps = [patientId, limit];

	return useConsultationsAndAppointments(query, options, deps);
};

export default useConsultationsForPatient;
