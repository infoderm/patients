import React from 'react';
import {useParams} from 'react-router-dom';

import {myDecodeURIComponent} from '../../util/uri';

import Loading from '../navigation/Loading';

import ConsultationEditor from './ConsultationEditor';

import useBookPrefill from './useBookPrefill';

type Params = {
	id: string;
};

const NewConsultation = () => {
	const params = useParams<Params>();
	const patientId = myDecodeURIComponent(params.id)!;
	const {loading, bookNumber} = useBookPrefill();

	if (loading) return <Loading />;

	const consultation = {
		_id: undefined,
		patientId,
		isDone: true,
		datetime: new Date(),
		reason: '',
		done: '',
		todo: '',
		treatment: '',
		next: '',
		more: '',
		currency: 'EUR',
		payment_method: 'cash',
		book: bookNumber,
	};

	return (
		<ConsultationEditor found loading={false} consultation={consultation} />
	);
};

export default NewConsultation;
