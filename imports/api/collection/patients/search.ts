import schema from '../../../lib/schema';
import define from '../define';
import {patientSex} from '../patients';

export const patientSearchIndexDocument = schema.object({
	_id: schema.string(),
	firstnameWords: schema.array(schema.string()),
	lastnameWords: schema.array(schema.string()),
	innerTrigrams: schema.array(schema.string()),
	outerTrigrams: schema.array(schema.string()),
	niss: schema.string(),
	firstname: schema.string(),
	lastname: schema.string(),
	birthdate: schema.string(),
	deathdateModifiedAt: schema.date().optional(),
	lastModifiedAt: schema.date(),
	sex: patientSex,
	owner: schema.string(),
});

export type PatientSearchIndexDocument = schema.infer<
	typeof patientSearchIndexDocument
>;

export const indexCollection = 'patients.index.collection';
export const PatientsSearchIndex =
	define<PatientSearchIndexDocument>(indexCollection);
