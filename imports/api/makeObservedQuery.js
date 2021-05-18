import {Meteor} from 'meteor/meteor';
import {useState, useEffect, useRef} from 'react';

const makeObservedQuery = (Collection, subscription) => (
	query,
	options,
	deps
) => {
	const [loading, setLoading] = useState(true);
	const [results, setResults] = useState([]);
	const [dirty, setDirty] = useState(false);
	const handleRef = useRef(null);

	useEffect(() => {
		setDirty(false);

		const timestamp = Date.now();
		const key = JSON.stringify({timestamp, query, options});
		const handle = Meteor.subscribe(subscription, key, query, options, {
			onStop: () => {
				if (handleRef.current === handle) {
					setDirty(true);
					setLoading(false);
				}
			},
			onReady: () => {
				const {results} = Collection.findOne({key});
				setResults(results);
				setLoading(false);
			}
		});
		handleRef.current = handle;

		return () => {
			handle.stop();
		};
	}, deps);

	return {loading, results, dirty};
};

export default makeObservedQuery;
