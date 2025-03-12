import schema from '../../util/schema';

import define from './define';

export const slotFields = schema
	.object({
		begin: schema.date(),
		end: schema.date(),
		weekShiftedBegin: schema.number(),
		weekShiftedEnd: schema.number(),
		measure: schema.number(),
		weight: schema.number(),
	})
	.strict();

export type SlotFields = schema.infer<typeof slotFields>;

export const slotMetadata = schema
	.object({
		_id: schema.string(),
		owner: schema.string(),
	})
	.strict();

export type SlotMetadata = schema.infer<typeof slotMetadata>;

export const slotDocument = slotFields.merge(slotMetadata);
export type SlotDocument = schema.infer<typeof slotDocument>;

const availabilityCollectionName = 'availability';
export const Availability = define<SlotDocument>(availabilityCollectionName);
