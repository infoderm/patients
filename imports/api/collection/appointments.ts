import {ConsultationMetadata} from './consultations';

export {Consultations as Appointments} from './consultations';

export interface AppointmentFields {
	patientId: string;
	datetime: Date;
	scheduledDatetime: Date;
	duration: number;
	begin: Date;
	reason: string;

	isDone: boolean;
}

interface AppointmentCancellationFields {
	isCancelled?: boolean;
	cancellationDatetime?: Date;
	cancellationReason?: string;
	cancellationExplanation?: string;
}

export interface AppointmentComputedFields {
	end: Date;
}

export type AppointmentDocument = AppointmentFields &
	AppointmentCancellationFields &
	AppointmentComputedFields &
	ConsultationMetadata;
