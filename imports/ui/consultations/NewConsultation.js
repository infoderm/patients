import React from 'react';

import Loading from '../navigation/Loading.js';

import ConsultationEditor from './ConsultationEditor.js';

import useBookPrefill from './useBookPrefill.js';

const NewConsultationEditor = ({match}) => {
	const {loading, bookNumber} = useBookPrefill();

	if (loading) return <Loading />;

	const consultation = {
		_id: undefined,
		patientId: match.params.id,
		datetime: new Date(),
		reason: '',
		done: '',
		todo: '',
		treatment: '',
		next: '',
		more: '',
		currency: 'EUR',
		payment_method: 'cash',
		price: 0,
		paid: 0,
		book: bookNumber
	};

	return (
		<ConsultationEditor found loading={false} consultation={consultation} />
	);
};

export default NewConsultationEditor;
