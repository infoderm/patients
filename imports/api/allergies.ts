import {Patients} from './collection/patients';
import TagDocument from './tags/TagDocument';
import createTagCollection from './createTagCollection';

const {
	Collection: Allergies,
	operations: allergies,
	useTags: useAllergies,
	useTagsFind: useAllergiesFind,
	useTagStats: useAllergyStats,
	useTaggedDocuments: usePatientsHavingAllergy,
} = createTagCollection({
	collection: 'allergies',
	publication: 'allergies',
	singlePublication: 'allergy',
	Parent: Patients,
	parentPublication: 'patients',
	key: 'allergies',
});

export {
	Allergies,
	allergies,
	useAllergies,
	useAllergiesFind,
	useAllergyStats,
	usePatientsHavingAllergy,
};

export interface AllergyDocument extends TagDocument {
	color?: string;
}
