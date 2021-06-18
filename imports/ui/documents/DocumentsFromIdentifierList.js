import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import PropTypes from 'prop-types';

import {Documents} from '../../api/documents';

import {myDecodeURIComponent} from '../../client/uri';

import StaticDocumentList from './StaticDocumentList';

const DocumentsFromIdentifierList = withTracker(({match, page, perpage}) => {
	page =
		(match && match.params.page && Number.parseInt(match.params.page, 10)) ||
		page ||
		DocumentsFromIdentifierList.defaultProps.page;
	perpage = perpage || DocumentsFromIdentifierList.defaultProps.perpage;
	const identifier = myDecodeURIComponent(match.params.identifier);
	const query = {identifier};
	const sort = {
		datetime: -1
	};
	const fields = {
		source: 0,
		decoded: 0,
		results: 0,
		text: 0
	};
	const options = {
		sort,
		fields,
		skip: (page - 1) * perpage,
		limit: perpage
	};
	const handle = Meteor.subscribe('documents', query, options);
	const loading = !handle.ready();
	return {
		page,
		perpage,
		root: `/documents/${match.params.identifier}`,
		loading,
		documents: loading ? [] : Documents.find(query, options).fetch()
	};
})(StaticDocumentList);

DocumentsFromIdentifierList.defaultProps = {
	page: 1,
	perpage: 10
};

DocumentsFromIdentifierList.propTypes = {
	page: PropTypes.number,
	perpage: PropTypes.number
};

export default DocumentsFromIdentifierList;
