import schema from '../../util/schema';

import define from './define';

export const paymentMethod = schema.union([
	schema.literal('cash'),
	schema.literal('wire'),
	schema.literal('third-party'),
]);

export type PaymentMethod = schema.infer<typeof paymentMethod>;

export const consultationFields = schema
	.object({
		patientId: schema.string(),
		datetime: schema.date(),
		scheduledDatetime: schema.date().optional(),
		realDatetime: schema.date().optional(),
		duration: schema.number().optional(),
		reason: schema.string(),
		done: schema.string().optional(),
		todo: schema.string().optional(),
		treatment: schema.string().optional(),
		next: schema.string().optional(),
		more: schema.string().optional(),

		currency: schema.string().optional(),
		price: schema.number().int().gte(0).optional(),
		paid: schema.number().int().gte(0).optional(),
		unpaid: schema.boolean().optional(),
		book: schema.string().optional(),
		inBookNumber: schema.number().int().gte(1).optional(),
		payment_method: paymentMethod.optional(),
		isCancelled: schema.boolean().optional(),
		cancellationDatetime: schema.date().optional(),
		cancellationReason: schema.string().optional(),
		cancellationExplanation: schema.string().optional(),

		attachments: schema.array(schema.string()).optional(),
	})
	.strict();

export type ConsultationFields = schema.infer<typeof consultationFields>;

export const consultationComputedFields = schema
	.object({
		isDone: schema.boolean(),
		doneDatetime: schema.date().optional(),
		begin: schema.date(),
		end: schema.date(),
	})
	.strict();

export type ConsultationComputedFields = schema.infer<
	typeof consultationComputedFields
>;

export const consultationMetadata = schema
	.object({
		_id: schema.string(),
		owner: schema.string(),
		createdAt: schema.date(),
		lastModifiedAt: schema.date(),
	})
	.strict();

export type ConsultationMetadata = schema.infer<typeof consultationMetadata>;

export const consultationDocument = consultationFields
	.merge(consultationComputedFields)
	.merge(consultationMetadata);

export type ConsultationDocument = schema.infer<typeof consultationDocument>;

export const collection = 'consultations';

export const Consultations = define<ConsultationDocument>(collection);
