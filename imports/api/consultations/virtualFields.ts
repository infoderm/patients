import startOfToday from 'date-fns/startOfToday';
import isBefore from 'date-fns/isBefore';

import {ConsultationDocument} from '../consultations';

const virtualFields = (consultation: ConsultationDocument) => {
	const {isDone, isCancelled, scheduledDatetime, currency, price, paid} =
		consultation;

	const missingPaymentData =
		currency === undefined || price === undefined || paid === undefined;
	const owes = !(missingPaymentData || paid === price);
	const owed = owes ? price - paid : 0;

	const isAppointment = !isDone;
	const isNoShow =
		isAppointment &&
		!isCancelled &&
		isBefore(scheduledDatetime, startOfToday());

	const didNotOrWillNotHappen = isCancelled || isNoShow;

	return {
		didNotOrWillNotHappen,
		isAppointment,
		isNoShow,
		missingPaymentData,
		owes,
		owed,
	};
};

export default virtualFields;
