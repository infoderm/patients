import {Patients} from './collection/patients';
import createTagCollection from './createTagCollection';

import {Doctors, collection} from './collection/doctors';
import patients from './publication/patients/patients';

const {
	operations: doctors,
	useTags: useDoctors,
	useTagsFind: useDoctorsFind,
	useTagStats: useDoctorStats,
	useTaggedDocuments: usePatientsGoingToDoctor,
	deleteEndpoint: deleteDoctor,
	renameEndpoint: renameDoctor,
} = createTagCollection({
	Collection: Doctors,
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
	usePatientsGoingToDoctor,
	deleteDoctor,
	renameDoctor,
};
