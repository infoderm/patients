import schema from '../../lib/schema';
import Collection from '../Collection';

export const drugDocument = schema.object({
	_id: schema.string(),
	owner: schema.string(),
	mppcv: schema.string().optional(),
	mpp_nl: schema.string().optional(),
	mpp_fr: schema.string().optional(),
	nvos_: schema.string().optional(),
});

export type DrugDocument = schema.infer<typeof drugDocument>;

export const Drugs = new Collection<DrugDocument>('drugs');
