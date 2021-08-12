import TagDocument, {TagFields} from './tags/TagDocument';
import createTagCollection from './createTagCollection';

const {
	Collection: Insurances,
	operations: insurances,
	useTags: useInsurances,
	useTagsFind: useInsurancesFind,
	useTagStats: useInsuranceStats,
} = createTagCollection({
	collection: 'insurances',
	publication: 'insurances',
	singlePublication: 'insurance',
	parentPublication: 'patients',
	key: 'insurances',
});

export {
	Insurances,
	insurances,
	useInsurances,
	useInsurancesFind,
	useInsuranceStats,
};

export type InsuranceDocument = TagDocument;
export type InsuranceFields = TagFields;
