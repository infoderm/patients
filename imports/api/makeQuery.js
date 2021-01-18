import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';
import {useState, useEffect} from 'react';

// TODO do not use useState and useEffect, simply exploit handle.ready();

const makeQuery = (Collection, subscription) => (query, options, deps) => {
	const [loading, setLoading] = useState(true);
	const [results, setResults] = useState([]);

	useEffect(() => {
		setLoading(true);
	}, deps);

	useTracker(() => {
		const handle = Meteor.subscribe(subscription, query, options);

		if (handle.ready()) {
			const results = Collection.find(query, options).fetch();
			setLoading(false);
			setResults(results);
		}
	}, deps);

	return {loading, results};
};

export default makeQuery;
