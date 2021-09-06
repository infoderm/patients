import {useTracker} from 'meteor/react-meteor-data';

import subscribe from '../../api/publication/subscribe';

import publication from '../../api/publication/books/consultations/stats';
import {Stats as Collection} from '../../api/collection/books/stats';

/**
 * useBookStats.
 *
 * @param {string} name
 */
const useBookStats = (name: string) =>
	useTracker(() => {
		const handle = subscribe(publication, name);
		return {
			loading: !handle.ready(),
			result: Collection.findOne({name}),
		};
	}, [name]);

export default useBookStats;
