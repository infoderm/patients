import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

import {useDebounce} from 'use-debounce';

import {TIMEOUT_REACTIVITY_DEBOUNCE} from '../constants';

const useLoggingIn = () => {
	const loggingIn = useTracker(() => Meteor.loggingIn(), []);

	const [debouncedLoggingIn] = useDebounce(
		loggingIn,
		TIMEOUT_REACTIVITY_DEBOUNCE
	);

	const displayLoggingIn = loggingIn && debouncedLoggingIn;

	return displayLoggingIn;
};

export default useLoggingIn;
