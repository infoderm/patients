import Collection from '../Collection';

type DrugDocument = {
	_id: string;
	owner: string;
	mppcv?: string;
	mpp_nl?: string;
	mpp_fr?: string;
	nvos_?: string;
};

export const Drugs = new Collection<DrugDocument>('drugs');
