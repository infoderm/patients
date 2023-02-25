import {Mongo} from 'meteor/mongo';

type Patient = {
	firstname: string;
	lastname: string;
};

export type DocumentResult = {
	name: string;
	flag?: string;
	code?: string;
	measure?: string;
	unit?: string;
	normal?: string;
};

export type DocumentId = string;

export type DocumentDocument = {
	_id: DocumentId;
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
	results?: DocumentResult[];
};

export const Documents = new Mongo.Collection<DocumentDocument>('documents');
