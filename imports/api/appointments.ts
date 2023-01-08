import addMilliseconds from 'date-fns/addMilliseconds';
import {optional, validate, where} from '../util/schema';
import removeUndefined from '../util/removeUndefined';
import {type Entry, makeSanitize, yieldKey} from './update';
import {
	type AppointmentComputedFields,
	type AppointmentFields,
} from './collection/appointments';

const sanitizeAppointmentGen = function* (
	fields: Partial<AppointmentFields>,
): IterableIterator<Entry<AppointmentFields & AppointmentComputedFields>> {
	yield* yieldKey(fields, 'patientId', String);
	if (
		Object.prototype.hasOwnProperty.call(fields, 'datetime') ||
		Object.prototype.hasOwnProperty.call(fields, 'duration')
	) {
		const {datetime, duration} = fields;
		validate(datetime, Date);
		validate(duration, Number);
		yield ['datetime', datetime];
		yield ['duration', duration];
		yield ['scheduledDatetime', datetime];
		yield ['begin', datetime];
		yield ['end', addMilliseconds(datetime, duration)];
		yield ['isDone', false];
	}

	yield* yieldKey(fields, 'reason', String);
};

const sanitizeAppointment = makeSanitize(sanitizeAppointmentGen);

export type AppointmentUpdate = {
	patient: {
		_id: string;
		firstname?: string;
		lastname?: string;
	};
	phone: string;
	datetime: Date;
	duration: number;
	reason: string;
};

export const sanitizeAppointmentUpdate = ({
	patient,
	phone,
	datetime,
	duration,
	reason,
}: Partial<AppointmentUpdate>) => {
	validate(
		patient,
		where((patient: any) => {
			if (patient === undefined) return phone === undefined;
			validate(patient._id, String);
			if (patient._id === '?') {
				validate(patient.firstname, String);
				validate(patient.lastname, String);
				validate(phone, String);
			}

			return true;
		}),
	);
	validate(datetime, optional(Date));
	validate(duration, optional(Number));
	validate(reason, optional(String));

	return {
		createPatient:
			patient?._id === '?'
				? {
						firstname: patient.firstname,
						lastname: patient.lastname,
						phone,
				  }
				: undefined,
		consultationUpdate: sanitizeAppointment(
			removeUndefined({
				patientId: patient?._id,
				datetime,
				duration,
				reason,
			}),
		),
	};
};
