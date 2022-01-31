import {check} from 'meteor/check';

import addMilliseconds from 'date-fns/addMilliseconds';

export interface SanitizeParams {
	datetime: Date;
	duration: number;
	patient: {
		_id: string;
		firstname: string;
		lastname: string;
	};
	phone?: string;
	reason: string;
}

function sanitize({
	datetime,
	duration,
	patient,
	phone,
	reason,
}: SanitizeParams) {
	check(patient.firstname, String);
	check(patient.lastname, String);
	check(patient._id, String);
	if (phone !== undefined) check(phone, String);
	check(datetime, Date);
	check(duration, Number);
	check(reason, String);

	return {
		createPatient: patient._id === '?',
		patientFields: {
			firstname: patient.firstname,
			lastname: patient.lastname,
			phone,
		},
		consultationFields: {
			patientId: patient._id,
			datetime,
			scheduledDatetime: datetime,
			duration,
			begin: datetime,
			end: addMilliseconds(datetime, duration),
			reason,
			isDone: false,
		},
	};
}

export const appointments = {
	sanitize,
};
