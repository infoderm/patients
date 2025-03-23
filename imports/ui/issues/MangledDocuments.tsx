import React from 'react';

import {useMangledDocuments} from '../../api/issues';

import paged from '../routes/paged';

import makeDocumentsList from '../documents/makeDocumentsList';

const DocumentsPage = makeDocumentsList(useMangledDocuments);
const DocumentsPager = paged(DocumentsPage);

type Props = React.JSX.IntrinsicAttributes &
	React.ClassAttributes<HTMLDivElement> &
	React.HTMLAttributes<HTMLDivElement>;

const MangledDocuments = (props: Props) => {
	return (
		<div {...props}>
			<DocumentsPager
				sort={{
					createdAt: 1,
				}}
				LoadingIndicator={(_: {}) => <>Loading...</>}
				EmptyPage={({page}: {readonly page: number}) =>
					page === 1 ? (
						<>All documents have been decoded :)</>
					) : (
						// eslint-disable-next-line react/jsx-no-useless-fragment
						<>{`Nothing to see on page ${page}.`}</>
					)
				}
			/>
		</div>
	);
};

export default MangledDocuments;
