import schema from '../../lib/schema';
import Collection from '../Collection';
import {formattedLineSchema, normalizedLineSchema} from '../string';

export const BIRTHDATE_FORMAT = 'yyyy-MM-dd';

export const patientSex = schema.union([
	schema.undefined(),
	schema.literal(''),
	schema.literal('male'),
	schema.literal('female'),
	schema.literal('other'),
]);

export type PatientSex = schema.infer<typeof patientSex>;

export const SEX_ALLOWED: PatientSex[] = [
	undefined,
	'',
	'male',
	'female',
	'other',
];

export const patientTag = schema.object({
	displayName: formattedLineSchema,
	name: normalizedLineSchema,
	comment: schema.string().optional(),
});

export type PatientTag = schema.infer<typeof patientTag>;

export const patientIdFields = schema.object({
	niss: schema.string(),
	firstname: schema.string(),
	lastname: schema.string(),
	birthdate: schema.string(),
	sex: patientSex,
	photo: schema.string(),

	municipality: schema.string(),
	streetandnumber: schema.string(),
	zip: schema.string(),
});

export type PatientIdFields = schema.infer<typeof patientIdFields>;

export const patientEmail = schema.object({
	name: schema.string().optional(),
	address: schema.string(),
	local: schema.string(),
	domain: schema.string(),
});

export type PatientEmail = schema.infer<typeof patientEmail>;

export const patientTagFields = schema.object({
	allergies: schema.array(patientTag).optional(),
	doctors: schema.array(patientTag).optional(),
	insurances: schema.array(patientTag).optional(),
});

export type PatientTagFields = schema.infer<typeof patientTagFields>;

const patientPersonalInformationFields = schema.object({
	deathdateModifiedAt: schema.date().optional(),
	deathdate: schema.date().optional(),
	phone: schema.string().optional(),

	antecedents: schema.string().optional(),
	ongoing: schema.string().optional(),
	about: schema.string().optional(),

	email: schema.array(patientEmail).optional(),

	noshow: schema.number().optional(), // TODO Should be .int()
	createdForAppointment: schema.boolean().optional(),
});

export type PatientPersonalInformationFields = schema.infer<
	typeof patientPersonalInformationFields
>;

export const patientFields = patientIdFields
	.partial()
	.merge(patientPersonalInformationFields)
	.merge(patientTagFields);
export type PatientFields = schema.infer<typeof patientFields>;

export const patientComputedFields = schema.object({
	normalizedName: schema.string(),
});

export type PatientComputedFields = schema.infer<typeof patientComputedFields>;

const patientMetadata = schema.object({
	_id: schema.string(),
	owner: schema.string(),
	createdAt: schema.date(),
});

export type PatientMetadata = schema.infer<typeof patientMetadata>;

export const patientDocument = patientFields
	.merge(patientComputedFields)
	.merge(patientMetadata);
export type PatientDocument = schema.infer<typeof patientDocument>;

const collection = 'patients';
export const Patients = new Collection<PatientDocument>(collection);
