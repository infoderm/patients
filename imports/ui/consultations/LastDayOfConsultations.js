import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';

import startOfToday from 'date-fns/startOfToday';
import startOfDay from 'date-fns/startOfDay';

import {Consultations} from '../../api/consultations.js';

import Loading from '../navigation/Loading.js';

import ConsultationsOfTheDay from './ConsultationsOfTheDay.js';

const LastDayOfConsultations = ({loading, lastConsultation}) => {
	if (loading) {
		return <Loading />;
	}

	const lastConsultationDate =
		lastConsultation && lastConsultation.datetime
			? startOfDay(lastConsultation.datetime)
			: startOfToday();

	return <ConsultationsOfTheDay day={lastConsultationDate} />;
};

export default withTracker(() => {
	const handle = Meteor.subscribe('consultations.last');

	if (!handle.ready()) {
		return {
			loading: true
		};
	}

	const lastConsultation = Consultations.findOne(
		{
			isDone: true
		},
		{
			sort: {
				datetime: -1,
				limit: 1
			}
		}
	);

	return {
		loading: false,
		lastConsultation
	};
})(LastDayOfConsultations);
