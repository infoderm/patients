import {Meteor} from 'meteor/meteor';
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
		let current = init;

		let queryHandle;
		const handle = Meteor.subscribe(subscription, query, options, {
			onStop: () => {
				if (queryHandle) queryHandle.stop();
			},
			onReady: () => {
				setLoading(false);
				queryHandle = Collection.find(query, options).observeChanges({
					added: (_id, upToDate) => {
						setFound(true);
						current = {...init, ...upToDate};
						setFields(current);
					},
					changed: (_id, upToDate) => {
						current = {...current, ...upToDate};
						setFields(current);
					},
					removed: (_id) => {
						setFound(false);
					}
				});
			}
		});

		return () => {
			handle.stop();
		};
	}, deps);

	return {loading, found, fields};
};

export default makeCachedFindOne;
