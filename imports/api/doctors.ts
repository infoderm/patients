import {Patients} from './collection/patients';
import createTagCollection from './createTagCollection';

import {Doctors, collection, doctorDocument} from './collection/doctors';
import patients from './publication/patients/patients';

const {
	operations: doctors,
	useTags: useDoctors,
	useTagsFind: useDoctorsFind,
	useTagStats: useDoctorStats,
	useTag: useDoctor,
	useCachedTag: useCachedDoctor,
	useTaggedDocuments: usePatientsGoingToDoctor,
	deleteEndpoint: deleteDoctor,
	renameEndpoint: renameDoctor,
} = createTagCollection({
	Collection: Doctors,
	// @ts-expect-error current limitation of zod. See https://github.com/colinhacks/zod/issues/2076
	tagDocumentSchema: doctorDocument,
	collection,
	publication: 'doctors',
	singlePublication: 'doctor',
	Parent: Patients,
	parentPublication: patients,
	key: 'doctors',
});

export {
	doctors,
	useDoctors,
	useDoctorsFind,
	useDoctorStats,
	useDoctor,
	useCachedDoctor,
	usePatientsGoingToDoctor,
	deleteDoctor,
	renameDoctor,
};
