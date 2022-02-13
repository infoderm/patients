import {Mongo} from 'meteor/mongo';

interface ConsultationFields {
	patientId: string;
	datetime: Date;
	scheduledDatetime?: Date;
	realDatetime?: Date;
	begin: Date;
	duration?: number;
	reason: string;
	done?: string;
	todo?: string;
	treatment?: string;
	next?: string;
	more?: string;

	currency?: string;
	price?: number;
	paid?: number;
	unpaid?: boolean;
	book?: string;
	inBookNumber?: number;
	payment_method?: string;
	isDone: boolean;
	isCancelled?: boolean;
	cancellationDatetime?: Date;
	cancellationReason?: string;
	cancellationExplanation?: string;

	attachments?: string[];
}

interface ConsultationComputedFields {
	doneDatetime?: Date;
	end: Date;
}

export interface ConsultationMetadata {
	_id: string;
	owner: string;
	createdAt: Date;
	lastModifiedAt: Date;
}

export type ConsultationDocument = ConsultationFields &
	ConsultationComputedFields &
	ConsultationMetadata;

export const collection = 'consultations';

export const Consultations = new Mongo.Collection<ConsultationDocument>(
	collection,
);
