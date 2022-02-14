import startOfToday from 'date-fns/startOfToday';
import isBefore from 'date-fns/isBefore';

import {ConsultationDocument} from '../collection/consultations';

const virtualFields = (consultation: ConsultationDocument) => {
	const {
		isDone,
		isCancelled,
		scheduledDatetime,
		currency,
		price,
		paid,
		payment_method,
	} = consultation;

	const missingPaymentData =
		currency === undefined || price === undefined || paid === undefined;
	const owes = !(missingPaymentData || paid === price);
	const owed = owes ? price - paid : 0;
	const isRemote = payment_method === 'third-party';

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
		isRemote,
		missingPaymentData,
		owes,
		owed,
	};
};

export default virtualFields;
