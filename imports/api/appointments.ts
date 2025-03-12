import addMilliseconds from 'date-fns/addMilliseconds';

import schema from '../util/schema';
import removeUndefined from '../util/object/removeUndefined';

import {type UpdateEntry, makeSanitize, yieldKey} from './update';
import {
	type AppointmentComputedFields,
	type AppointmentFields,
} from './collection/appointments';
import {type DocumentUpdate} from './DocumentUpdate';

const sanitizeAppointmentGen = function* (
	fields: DocumentUpdate<{
		patientId: string;
		datetime?: Date;
		duration?: number;
		reason: string;
	}>,
): IterableIterator<
	UpdateEntry<AppointmentFields & AppointmentComputedFields>
> {
	yield* yieldKey(fields, 'patientId', schema.string());
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

	yield* yieldKey(fields, 'reason', schema.string());
};

const sanitizeAppointment = makeSanitize(sanitizeAppointmentGen);

export const appointmentUpdate = schema.union([
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
			firstname: schema.string().optional(),
			lastname: schema.string().optional(),
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
]);

export type AppointmentUpdate = schema.infer<typeof appointmentUpdate>;

export const sanitizeAppointmentUpdate = ({
	patient,
	phone,
	datetime,
	duration,
	reason,
}: Partial<AppointmentUpdate>) => ({
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
});
