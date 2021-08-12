import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

import {books} from '../../api/books';

const Collection = books.cache.Stats;
const subscription = books.options.parentPublicationStats;

/**
 * useBookStats.
 *
 * @param {string} name
 */
const useBookStats = (name: string) =>
	useTracker(() => {
		const handle = Meteor.subscribe(subscription, name);
		return {
			loading: !handle.ready(),
			result: Collection.findOne({name}),
		};
	}, [name]);

export default useBookStats;
