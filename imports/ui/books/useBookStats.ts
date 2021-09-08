import {useTracker} from 'meteor/react-meteor-data';

import subscribe from '../../api/publication/subscribe';

import publication from '../../api/publication/books/consultations/stats';
import {Stats as Collection} from '../../api/collection/books/stats';

const useBookStats = (name: string) =>
	useTracker(() => {
		const handle = subscribe(publication, name);
		const loading = !handle.ready();
		const result = Collection.findOne({name});
		const found = result !== undefined;
		return {
			loading,
			found,
			result,
		};
	}, [name]);

export default useBookStats;
