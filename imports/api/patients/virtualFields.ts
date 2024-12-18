import {type PatientDocument} from '../collection/patients';
import eidParseBirthdate from '../eidParseBirthdate';

const virtualFields = (patient: Omit<PatientDocument, 'deathdate'> & {deathdate?: Date | null}) => {
	const birthdate = eidParseBirthdate(patient.birthdate ?? '');
	const deathdateModifiedAt = patient.deathdateModifiedAt ?? undefined;
	const deathdateLegal = patient.deathdate ?? undefined;
	const deathdate = deathdateLegal ?? deathdateModifiedAt;
	const isDead = deathdateModifiedAt !== undefined;
	return {
		birthdate,
		isDead,
		deathdateModifiedAt,
		deathdateLegal,
		deathdate,
	};
};

export default virtualFields;
