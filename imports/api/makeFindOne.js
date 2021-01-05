import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

const makeFindOne = (Collection, subscription) => (
	init,
	query,
	options,
	deps
) => {
	const loading = useTracker(() => {
		const handle = Meteor.subscribe(subscription, query, options);
		return !handle.ready();
	}, deps);

	const upToDate = useTracker(() => {
		return Collection.findOne(query, options);
	}, deps);

	const found = Boolean(upToDate);

	const fields = {...init, ...upToDate};

	return {loading, found, fields};
};

export default makeFindOne;
