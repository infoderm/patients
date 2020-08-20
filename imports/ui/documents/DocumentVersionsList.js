import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import PropTypes from 'prop-types';

import {Documents} from '../../api/documents.js';

import {myDecodeURIComponent} from '../../client/uri.js';

import StaticDocumentList from './StaticDocumentList.js';

const DocumentsVersionsList = withTracker(({match, page, perpage}) => {
	page =
		(match && match.params.page && Number.parseInt(match.params.page, 10)) ||
		page ||
		DocumentsVersionsList.defaultProps.page;
	perpage = perpage || DocumentsVersionsList.defaultProps.perpage;
	const identifier = myDecodeURIComponent(match.params.identifier);
	const reference = myDecodeURIComponent(match.params.reference);
	const sort = {
		status: 1,
		datetime: -1
	};
	const fields = {
		source: 0,
		decoded: 0,
		results: 0,
		text: 0
	};
	const handle = Meteor.subscribe('documents.versions', identifier, reference, {
		sort,
		fields
	});
	const loading = !handle.ready();
	return {
		page,
		perpage,
		root: `/document/versions/${match.params.identifier}/${match.params.reference}`,
		loading,
		documents: loading
			? []
			: Documents.find(
					{
						identifier,
						reference
					},
					{
						sort,
						fields,
						skip: (page - 1) * perpage,
						limit: perpage
					}
			  ).fetch()
	};
})(StaticDocumentList);

DocumentsVersionsList.defaultProps = {
	page: 1,
	perpage: 10
};

DocumentsVersionsList.propTypes = {
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired
};

export default DocumentsVersionsList;
