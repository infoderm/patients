import createTagCollection from './createTagCollection.js';

const {
	Collection: Insurances,
	operations: insurances,
	useTags: useInsurances
} = createTagCollection({
	collection: 'insurances',
	publication: 'insurances',
	singlePublication: 'insurance',
	parentPublication: 'patients-of-insurance',
	key: 'insurances'
});

export {Insurances, insurances, useInsurances};
