import schema from '../../lib/schema';

import define from './define';

export const drugDocument = schema.object({
	_id: schema.string(),
	owner: schema.string(),
	mppcv: schema.string().optional(),
	mpp_nl: schema.string().optional(),
	mpp_fr: schema.string().optional(),
	nvos_: schema.string().optional(),
});

export type DrugDocument = schema.infer<typeof drugDocument>;

export const Drugs = define<DrugDocument>('drugs');
