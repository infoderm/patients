import addMilliseconds from 'date-fns/addMilliseconds';
import schema from '../lib/schema';
import removeUndefined from '../lib/object/removeUndefined';
import {type Entry, makeSanitize, yieldKey} from './update';
import {
	type AppointmentComputedFields,
	type AppointmentFields,
} from './collection/appointments';

const sanitizeAppointmentGen = function* (fields: {
	patientId: string;
	datetime?: Date;
	duration?: number;
	reason: string;
}): IterableIterator<Entry<AppointmentFields & AppointmentComputedFields>> {
	yield* yieldKey(fields, 'patientId', String);
	if (
		Object.prototype.hasOwnProperty.call(fields, 'datetime') ||
		Object.prototype.hasOwnProperty.call(fields, 'duration')
	) {
		const {datetime, duration} = schema
			.object({
				datetime: schema.date(),
				duration: schema.number(),
			})
			.parse(fields);

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
	patient?: {
		_id: string;
		firstname?: string;
		lastname?: string;
	};
	phone?: string;
	datetime: Date;
	duration: number;
	reason: string;
};

export const sanitizeAppointmentUpdate = (
	update: Partial<AppointmentUpdate>,
) => {
	const {patient, phone, datetime, duration, reason} = schema
		.union([
			// TODO Use schema.switch
			schema.object({
				patient: schema.object({
					_id: schema.literal('?'),
					firstname: schema.string(),
					lastname: schema.string(),
				}),
				phone: schema.string(),
				datetime: schema.date().optional(),
				duration: schema.number().optional(),
				reason: schema.string().optional(),
			}),
			schema.object({
				patient: schema.object({
					_id: schema.string(),
					firstname: schema.string(),
					lastname: schema.string(),
				}),
				phone: schema.string().optional(),
				datetime: schema.date().optional(),
				duration: schema.number().optional(),
				reason: schema.string().optional(),
			}),
			schema.object({
				patient: schema.undefined(),
				phone: schema.undefined(),
				datetime: schema.date().optional(),
				duration: schema.number().optional(),
				reason: schema.string().optional(),
			}),
		])
		.parse(update);

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
