import React from 'react';

import startOfDay from 'date-fns/startOfDay';
import addHours from 'date-fns/addHours';
import isAfter from 'date-fns/isAfter';

import {TIME_BREAK, TIME_EVENING} from '../constants';

import useUser from '../users/useUser';
import {useSetting} from '../settings/hooks';

import NoContent from './NoContent';

const Greetings = () => {
	const now = new Date();
	const today = startOfDay(now);
	const noon = addHours(today, TIME_BREAK);
	const evening = addHours(today, TIME_EVENING);
	const user = useUser();
	const {loading, value: displayName} = useSetting('user-account-display-name');
	if (loading) return null;

	let greeting = 'Bonjour';
	if (isAfter(now, evening)) {
		greeting = 'Bonsoir';
	} else if (isAfter(now, noon)) {
		greeting = 'Good afternoon';
	}

	return (
		<NoContent>
			{greeting} {displayName || user?.username}!
		</NoContent>
	);
};

export default Greetings;
