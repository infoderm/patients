import {Patients} from './collection/patients';
import createTagCollection from './createTagCollection';

import {
	Insurances,
	collection,
	insuranceDocument,
} from './collection/insurances';
import patients from './publication/patients/patients';

const {
	operations: insurances,
	useTags: useInsurances,
	useTagsFind: useInsurancesFind,
	useTagStats: useInsuranceStats,
	useTag: useInsurance,
	useCachedTag: useCachedInsurance,
	useTaggedDocuments: usePatientsInsuredBy,
	deleteEndpoint: deleteInsurance,
	renameEndpoint: renameInsurance,
} = createTagCollection({
	Collection: Insurances,
	// @ts-expect-error current limitation of zod. See https://github.com/colinhacks/zod/issues/2076
	tagDocumentSchema: insuranceDocument,
	collection,
	publication: 'insurances',
	singlePublication: 'insurance',
	Parent: Patients,
	parentPublication: patients,
	key: 'insurances',
});

export {
	insurances,
	useInsurances,
	useInsurancesFind,
	useInsuranceStats,
	useInsurance,
	useCachedInsurance,
	usePatientsInsuredBy,
	deleteInsurance,
	renameInsurance,
};
