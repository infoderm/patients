import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';
import Paginator from '../navigation/Paginator';

import DocumentsPage from './DocumentsPage';

export default function StaticDocumentList({
	page,
	perpage,
	loading,
	documents,
	root
}) {
	return (
		<>
			<div>
				{loading ? (
					<Loading />
				) : documents.length > 0 ? (
					<DocumentsPage documents={documents} />
				) : (
					<NoContent>{`Nothing to see on page ${page}.`}</NoContent>
				)}
			</div>
			<Paginator page={page} end={documents.length < perpage} root={root} />
		</>
	);
}

StaticDocumentList.projection = DocumentsPage.projection;

StaticDocumentList.defaultProps = {
	loading: false
};

StaticDocumentList.propTypes = {
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
	loading: PropTypes.bool,
	documents: PropTypes.array.isRequired,
	root: PropTypes.string.isRequired
};
