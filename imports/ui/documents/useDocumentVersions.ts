import {useTracker} from 'meteor/react-meteor-data';
import {Documents} from '../../api/collection/documents';
import subscribe from '../../api/publication/subscribe';
import find from '../../api/publication/documents/find';

const useDocumentVersions = (document) => {
	const {parsed, identifier, reference} = document;

	const query = {identifier, reference};
	const options = {
		sort: {status: 1, datetime: -1},
		fields: {identifier: 1, reference: 1, status: 1, datetime: 1},
	};

	const deps = [JSON.stringify(query), JSON.stringify(options)];

	return useTracker(() => {
		if (!parsed) return {loading: false, versions: [document]};

		const handle = subscribe(find, query, options);
		return {
			loading: !handle.ready(),
			versions: Documents.find(query, options).fetch(),
		};
	}, deps);
};

export default useDocumentVersions;
