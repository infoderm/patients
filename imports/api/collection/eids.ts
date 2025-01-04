import schema from '../../lib/schema';

import define from './define';

export const eidFields = schema.object({
	xml: schema.object({
		encoding: schema.string(),
		version: schema.string(),
	}),
	eid: schema.object({
		graphpersoversion: schema.string(),
		version: schema.string(),
	}),
	card: schema.object({
		carddata_appl_version: schema.string(),
		cardnumber: schema.string(),
		chipnumber: schema.string(),
		documenttype: schema.string(),
		validitydatebegin: schema.string(),
		validitydateend: schema.string(),
		deliverymunicipality: schema.string(),
	}),
	certificates: schema.object({
		authentication: schema.string(),
		citizenca: schema.string(),
		root: schema.string(),
		rrn: schema.string(),
		signing: schema.string(),
	}),
	identity: schema.object({
		nationality: schema.string(),
		nationalnumber: schema.string(),
		dateofbirth: schema.string(),
		placeofbirth: schema.string(),
		gender: schema.string(),
		specialstatus: schema.string(),
		name: schema.string(),
		firstname: schema.string(),
		middlenames: schema.string(),
		photo: schema.string(),
	}),
	address: schema.object({
		municipality: schema.string(),
		streetandnumber: schema.string(),
		zip: schema.string(),
	}),
});

export type EidFields = schema.infer<typeof eidFields>;

const eidMetadata = schema.object({
	_id: schema.string(),
	owner: schema.string(),
	createdAt: schema.date(),
});

export type EidMetadata = schema.infer<typeof eidMetadata>;

export const eidDocument = eidFields
	.merge(eidMetadata);
export type EidDocument = schema.infer<typeof eidDocument>;

const collection = 'eids';
export const Eids = define<EidDocument>(collection);
