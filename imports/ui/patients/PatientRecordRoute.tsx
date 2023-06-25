import React from 'react';
import {useParams} from 'react-router-dom';

import {myDecodeURIComponent} from '../../lib/uri';

import PatientRecord from './PatientRecord';

type Params = {
	id: string;
};

const PatientRecordRoute = () => {
	const params = useParams<Params>();
	const patientId = myDecodeURIComponent(params.id)!;

	return <PatientRecord patientId={patientId} />;
};

export default PatientRecordRoute;
