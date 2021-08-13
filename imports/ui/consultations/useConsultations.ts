import useConsultationsAndAppointments from './useConsultationsAndAppointments';

const useConsultations = (query, options) => {
	const selector = {
		isDone: false,
		...query,
	};

	const deps = [JSON.stringify(query), JSON.stringify(options)];

	return useConsultationsAndAppointments(selector, options, deps);
};

export default useConsultations;
