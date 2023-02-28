import Collection from '../Collection';

export type SlotFields = {
	begin: Date;
	end: Date;
	weekShiftedBegin: number;
	weekShiftedEnd: number;
	measure: number;
	weight: number;
};

export type SlotMetadata = {
	_id: string;
	owner: string;
};

export type SlotDocument = SlotFields & SlotMetadata;

const availabilityCollectionName = 'availability';
export const Availability = new Collection<SlotDocument>(
	availabilityCollectionName,
);
