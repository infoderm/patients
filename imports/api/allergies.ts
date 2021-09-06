import {Patients} from './collection/patients';
import createTagCollection from './createTagCollection';

import {Allergies, collection} from './collection/allergies';

const {
	operations: allergies,
	useTags: useAllergies,
	useTagsFind: useAllergiesFind,
	useTagStats: useAllergyStats,
	useTaggedDocuments: usePatientsHavingAllergy,
} = createTagCollection({
	Collection: Allergies,
	collection,
	publication: 'allergies',
	singlePublication: 'allergy',
	Parent: Patients,
	parentPublication: 'patients',
	key: 'allergies',
});

export {
	allergies,
	useAllergies,
	useAllergiesFind,
	useAllergyStats,
	usePatientsHavingAllergy,
};
