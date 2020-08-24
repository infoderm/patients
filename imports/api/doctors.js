import createTagCollection from './createTagCollection.js';

const {
	Collection: Doctors,
	operations: doctors,
	useTags: useDoctors
} = createTagCollection({
	collection: 'doctors',
	publication: 'doctors',
	singlePublication: 'doctor',
	parentPublication: 'patients-of-doctor',
	key: 'doctors'
});

export {Doctors, doctors, useDoctors};
