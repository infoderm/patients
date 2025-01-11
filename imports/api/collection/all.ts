import type Collection from '../Collection';

import {Settings} from './settings';
import {Eids} from './eids';
import {Patients} from './patients';
import {PatientsSearchIndex} from './patients/search';
import {Drugs} from './drugs';
import {Consultations} from './consultations';
import {Events} from './events';
import {Attachments} from './attachments';
import {Insurances} from './insurances';
import {Doctors} from './doctors';
import {Allergies} from './allergies';
import {Books} from './books';
import {Documents} from './documents';
import {Availability} from './availability';

const collections: Array<Collection<any>> = [
	Settings,
	Eids,
	Patients,
	PatientsSearchIndex,
	Drugs,
	Consultations,
	Events,
	Attachments,
	Insurances,
	Doctors,
	Allergies,
	Books,
	Documents,
	Availability,
];

export default collections;
