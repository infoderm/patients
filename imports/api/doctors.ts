import TagDocument from './tags/TagDocument';
import createTagCollection from './createTagCollection';

const {
	Collection: Doctors,
	operations: doctors,
	useTags: useDoctors,
	useTagsFind: useDoctorsFind,
} = createTagCollection({
	collection: 'doctors',
	publication: 'doctors',
	singlePublication: 'doctor',
	parentPublication: 'patients-of-doctor',
	key: 'doctors',
});

export {Doctors, doctors, useDoctors, useDoctorsFind};

export type DoctorDocument = TagDocument;
