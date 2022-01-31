import {ConsultationMetadata} from './consultations';

export {Consultations as Appointments} from './consultations';

interface AppointmentFields {
	patientId: string;
	datetime: Date;
	scheduledDatetime: Date;
	duration: number;
	begin: Date;
	reason: string;

	isDone: boolean;
	isCancelled?: boolean;
	cancellationDatetime?: Date;
	cancellationReason?: string;
	cancellationExplanation?: string;
}

interface AppointmentComputedFields {
	end: Date;
}

export type AppointmentDocument = AppointmentFields &
	AppointmentComputedFields &
	ConsultationMetadata;
