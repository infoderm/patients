import {Patients} from './collection/patients';
import createTagCollection from './createTagCollection';

import {Insurances, collection} from './collection/insurances';
import patients from './publication/patients/patients';

const {
	operations: insurances,
	useTags: useInsurances,
	useTagsFind: useInsurancesFind,
	useTagStats: useInsuranceStats,
	useTaggedDocuments: usePatientsInsuredBy,
	deleteEndpoint: deleteInsurance,
	renameEndpoint: renameInsurance,
} = createTagCollection({
	Collection: Insurances,
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
	usePatientsInsuredBy,
	deleteInsurance,
	renameInsurance,
};
