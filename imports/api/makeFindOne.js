import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

const makeFindOne = (Collection, subscription) => (
	init,
	query,
	options,
	_deps
) => {
	const loading = useTracker(
		() => {
			const handle = Meteor.subscribe(subscription, query, options);
			return !handle.ready();
		} /* , deps */
	);

	const upToDate = useTracker(
		() => {
			return loading ? undefined : Collection.findOne(query, options);
		} /* , [loading, ...deps] */
	);

	const found = Boolean(upToDate);

	const fields = {...init, ...upToDate};

	return {loading, found, fields};
};

export default makeFindOne;
