import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';
import {useRef} from 'react';

const makeCachedFindOne = (Collection, subscription) => (
	init,
	query,
	options,
	deps
) => {
	const ref = useRef(init);

	const loading = useTracker(() => {
		const handle = Meteor.subscribe(subscription, query, options);
		return !handle.ready();
	}, deps);

	const upToDate = useTracker(() => {
		return loading ? undefined : Collection.findOne(query, options);
	}, [loading, ...deps]);

	const found = Boolean(upToDate);
	const fields = {...ref.current, ...upToDate};
	ref.current = fields;

	return {loading, found, fields};
};

export default makeCachedFindOne;
