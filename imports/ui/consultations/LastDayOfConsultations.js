import React from 'react';

import startOfToday from 'date-fns/startOfToday';
import startOfDay from 'date-fns/startOfDay';

import Loading from '../navigation/Loading.js';

import ConsultationsOfTheDay from './ConsultationsOfTheDay.js';

import useLastConsultation from './useLastConsultation.js';

const LastDayOfConsultations = () => {
	const {loading, consultation} = useLastConsultation();

	if (loading) return <Loading />;

	const consultationDate = consultation?.datetime
		? startOfDay(consultation.datetime)
		: startOfToday();

	return <ConsultationsOfTheDay day={consultationDate} />;
};

export default LastDayOfConsultations;
