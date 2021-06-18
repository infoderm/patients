import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';
import {Documents} from '../../api/documents';

const useDocumentVersions = (document) => {
	const {parsed, identifier, reference} = document;

	const query = {identifier, reference};
	const options = {
		sort: {status: 1, datetime: -1},
		fields: {identifier: 1, reference: 1, status: 1, datetime: 1}
	};

	const deps = [JSON.stringify(query), JSON.stringify(options)];

	return useTracker(() => {
		if (!parsed) return {loading: false, versions: [document]};

		const handle = Meteor.subscribe('documents', query, options);
		return {
			loading: !handle.ready(),
			versions: Documents.find(query, options).fetch()
		};
	}, deps);
};

export default useDocumentVersions;
