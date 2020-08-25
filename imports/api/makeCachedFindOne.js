import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';
import {useState, useEffect} from 'react';

const makeCachedFindOne = (Collection, subscription) => (
	init,
	query,
	options,
	deps
) => {
	const [loading, setLoading] = useState(true);
	const [found, setFound] = useState(false);
	const [fields, setFields] = useState(init);

	useEffect(() => {
		setLoading(true);
		setFound(false);
		setFields(init);
	}, deps);

	useTracker(() => {
		const handle = Meteor.subscribe(subscription, query, options);

		if (handle.ready()) {
			const upToDate = Collection.findOne(query, options);
			setLoading(false);
			setFound(Boolean(upToDate));
			setFields({...fields, ...upToDate});
		}
	}, deps);

	return {loading, found, fields};
};

export default makeCachedFindOne;
