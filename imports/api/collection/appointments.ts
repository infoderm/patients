import {type ConsultationMetadata} from './consultations';

export {Consultations as Appointments} from './consultations';

export type AppointmentFields = {
	patientId: string;
	datetime: Date;
	scheduledDatetime: Date;
	duration: number;
	begin: Date;
	reason: string;

	isDone: boolean;
};

type AppointmentCancellationFields = {
	isCancelled?: boolean;
	cancellationDatetime?: Date;
	cancellationReason?: string;
	cancellationExplanation?: string;
};

export type AppointmentComputedFields = {
	end: Date;
};

export type AppointmentDocument = AppointmentFields &
	AppointmentCancellationFields &
	AppointmentComputedFields &
	ConsultationMetadata;
