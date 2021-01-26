import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {Documents} from '../../api/documents.js';

const withDocumentVersions = withTracker(({document}) => {
	const {parsed, identifier, reference} = document;

	if (!parsed) return {loading: false, versions: [document]};

	const query = {identifier, reference};
	const options = {
		sort: {status: 1, datetime: -1},
		fields: {identifier: 1, reference: 1, status: 1, datetime: 1}
	};
	const handle = Meteor.subscribe('documents', query, options);
	return {
		loading: !handle.ready(),
		versions: Documents.find(query, options).fetch()
	};
});

withDocumentVersions.propTypes = {
	document: PropTypes.object.isRequired
};

export default withDocumentVersions;
