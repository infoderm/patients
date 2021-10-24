import {Mongo} from 'meteor/mongo';

export interface SlotFields {
	begin: Date;
	end: Date;
	weekShiftedBegin: number;
	weekShiftedEnd: number;
	measure: number;
	weight: number;
}

export interface SlotMetadata {
	_id: string;
	owner: string;
}

export type SlotDocument = SlotFields & SlotMetadata;

const availabilityCollectionName = 'availability';
export const Availability = new Mongo.Collection<SlotDocument>(
	availabilityCollectionName,
);
