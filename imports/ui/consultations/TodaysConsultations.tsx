import React from 'react';

import startOfToday from 'date-fns/startOfToday';

import ConsultationsOfTheDay from './ConsultationsOfTheDay';

const LastDayOfConsultations = () => (
	<ConsultationsOfTheDay day={startOfToday()} /> // TODO Make reactive?
);

export default LastDayOfConsultations;
