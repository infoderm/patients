import TagDocument, {TagFields} from './tags/TagDocument';
import createTagCollection from './createTagCollection';

const {
	Collection: Doctors,
	operations: doctors,
	useTags: useDoctors,
	useTagsFind: useDoctorsFind,
	useTagStats: useDoctorStats,
} = createTagCollection({
	collection: 'doctors',
	publication: 'doctors',
	singlePublication: 'doctor',
	parentPublication: 'patients',
	key: 'doctors',
});

export {Doctors, doctors, useDoctors, useDoctorsFind, useDoctorStats};

export type DoctorDocument = TagDocument;
export type DoctorFields = TagFields;
