import React from 'react';
import {useParams} from 'react-router-dom';
import {myDecodeURIComponent} from '../../util/uri';
import PatientRecord from './PatientRecord';

interface Params {
	id: string;
	tab?: string;
	page?: string;
}

const PatientRecordRoute = () => {
	const params = useParams<Params>();
	const patientId = myDecodeURIComponent(params.id);
	const tab = params.tab;
	const page = Number.parseInt(params.page, 10) || undefined;

	return <PatientRecord patientId={patientId} tab={tab} page={page} />;
};

export default PatientRecordRoute;
