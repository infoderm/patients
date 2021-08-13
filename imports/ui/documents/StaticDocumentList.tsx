import React from 'react';
import PropTypes, {InferProps} from 'prop-types';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';
import Paginator from '../navigation/Paginator';

import DocumentsPage from './DocumentsPage';

const StaticDocumentListPropTypes = {
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
	loading: PropTypes.bool,
	documents: PropTypes.array.isRequired,
	root: PropTypes.string.isRequired,
};

type Props = InferProps<typeof StaticDocumentListPropTypes>;

const StaticDocumentList = ({
	page,
	perpage,
	loading = false,
	documents,
	root,
}: Props) => (
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

StaticDocumentList.projection = DocumentsPage.projection;

StaticDocumentList.propTypes = StaticDocumentListPropTypes;

export default StaticDocumentList;
