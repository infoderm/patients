import {Patients} from './collection/patients';
import createTagCollection from './createTagCollection';

import {Allergies, allergyDocument, collection} from './collection/allergies';
import patients from './publication/patients/patients';

const {
	operations: allergies,
	useTags: useAllergies,
	useTagsFind: useAllergiesFind,
	useTagStats: useAllergyStats,
	useTag: useAllergy,
	useCachedTag: useCachedAllergy,
	useTaggedDocuments: usePatientsHavingAllergy,
	deleteEndpoint: deleteAllergy,
	renameEndpoint: renameAllergy,
} = createTagCollection({
	Collection: Allergies,
	// @ts-expect-error current limitation of zod. See https://github.com/colinhacks/zod/issues/2076
	tagDocumentSchema: allergyDocument,
	collection,
	publication: 'allergies',
	singlePublication: 'allergy',
	Parent: Patients,
	parentPublication: patients,
	key: 'allergies',
});

export {
	allergies,
	useAllergies,
	useAllergiesFind,
	useAllergyStats,
	useAllergy,
	useCachedAllergy,
	usePatientsHavingAllergy,
	deleteAllergy,
	renameAllergy,
};
