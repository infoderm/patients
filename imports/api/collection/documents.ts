import Collection from '../Collection';

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
	createdAt: Date;
	deleted?: boolean;
} & (
	| {
			parsed: false;
			format: undefined;
			kind: undefined;
			patientId: undefined;
			identifier: undefined;
			reference: undefined;
			datetime: undefined;
			lastVersion: undefined;
			anomalies: undefined;
			patient: undefined;
			status: undefined;
			results: undefined;
	  }
	| {
			parsed: true;
			format: string;
			kind: string;
			patientId: string;
			identifier: string;
			reference: string;
			datetime: Date;
			lastVersion: boolean;
			anomalies: number;
			patient: Patient;
			status: string;
			results: DocumentResult[];
	  }
);

export const Documents = new Collection<DocumentDocument>('documents');
