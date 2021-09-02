import {Patients} from './collection/patients';
import TagDocument, {TagFields} from './tags/TagDocument';
import createTagCollection from './createTagCollection';

const {
	Collection: Insurances,
	operations: insurances,
	useTags: useInsurances,
	useTagsFind: useInsurancesFind,
	useTagStats: useInsuranceStats,
	useTaggedDocuments: usePatientsInsuredBy,
} = createTagCollection({
	collection: 'insurances',
	publication: 'insurances',
	singlePublication: 'insurance',
	Parent: Patients,
	parentPublication: 'patients',
	key: 'insurances',
});

export {
	Insurances,
	insurances,
	useInsurances,
	useInsurancesFind,
	useInsuranceStats,
	usePatientsInsuredBy,
};

export type InsuranceDocument = TagDocument;
export type InsuranceFields = TagFields;
