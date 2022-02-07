import {Mongo} from 'meteor/mongo';

interface Patient {
	firstname: string;
	lastname: string;
}

export interface DocumentDocument {
	_id: string;
	owner: string;
	encoding?: string;
	decoded: string;
	source: string;
	parsed: boolean;
	format?: string;
	kind?: string;
	patientId?: string;
	identifier?: string;
	reference?: string;
	datetime?: Date;
	createdAt: Date;
	lastVersion?: boolean;
	anomalies?: number;
	patient?: Patient;
	deleted?: boolean;
	status?: string;
}

export const Documents = new Mongo.Collection<DocumentDocument>('documents');
