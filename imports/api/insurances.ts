import TagDocument from './tags/TagDocument';
import createTagCollection from './createTagCollection';

const {
	Collection: Insurances,
	operations: insurances,
	useTags: useInsurances,
	useTagsFind: useInsurancesFind
} = createTagCollection({
	collection: 'insurances',
	publication: 'insurances',
	singlePublication: 'insurance',
	parentPublication: 'patients-of-insurance',
	key: 'insurances'
});

export {Insurances, insurances, useInsurances, useInsurancesFind};

export type InsuranceDocument = TagDocument;
