import schema from '../../lib/schema';
import {consultationMetadata} from './consultations';

export {Consultations as Appointments} from './consultations';

export const appointmentFields = schema
	.object({
		patientId: schema.string(),
		datetime: schema.date(),
		scheduledDatetime: schema.date(),
		begin: schema.date(),
		duration: schema.number(),
		reason: schema.string(),

		isDone: schema.boolean(),
	})
	.strict();

export type AppointmentFields = schema.infer<typeof appointmentFields>;

export const appointmentCancellationFields = schema
	.object({
		isCancelled: schema.boolean(),
		cancellationDatetime: schema.date(),
		cancellationReason: schema.string(),
		cancellationExplanation: schema.string(),
	})
	.strict()
	.partial();

export type AppointmentCancellationFields = schema.infer<
	typeof appointmentCancellationFields
>;

export const appointmentComputedFields = schema
	.object({
		end: schema.date(),
	})
	.strict();

export type AppointmentComputedFields = schema.infer<
	typeof appointmentComputedFields
>;

export const appointmentDocument = appointmentFields
	.merge(appointmentCancellationFields)
	.merge(appointmentComputedFields)
	.merge(consultationMetadata);

export type AppointmentDocument = schema.infer<typeof appointmentDocument>;
