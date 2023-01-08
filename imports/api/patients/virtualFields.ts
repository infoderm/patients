import {type PatientDocument} from '../collection/patients';
import eidParseBirthdate from '../eidParseBirthdate';

const virtualFields = (patient: PatientDocument) => {
	const birthdate = eidParseBirthdate(patient.birthdate);
	const deathdateModifiedAt = patient.deathdateModifiedAt ?? null;
	const deathdateLegal = patient.deathdate ?? null;
	const deathdate = deathdateLegal ?? deathdateModifiedAt;
	const isDead = deathdateModifiedAt !== null;
	return {
		birthdate,
		isDead,
		deathdateModifiedAt,
		deathdateLegal,
		deathdate,
	};
};

export default virtualFields;
