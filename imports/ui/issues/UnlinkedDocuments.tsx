import React from 'react';

import {useUnlinkedDocuments} from '../../api/issues';

import paged from '../routes/paged';

import makeDocumentsList from '../documents/makeDocumentsList';

const DocumentsPage = makeDocumentsList(useUnlinkedDocuments);
const DocumentsPager = paged(DocumentsPage);

type Props = React.JSX.IntrinsicAttributes &
	React.ClassAttributes<HTMLDivElement> &
	React.HTMLAttributes<HTMLDivElement>;

const UnlinkedDocuments = (props: Props) => {
	return (
		<div {...props}>
			<DocumentsPager
				sort={{
					'patient.lastname': 1,
					'patient.firstname': 1,
					datetime: 1,
					createdAt: 1,
				}}
				LoadingIndicator={(_: {}) => <>Loading...</>}
				EmptyPage={({page}: {readonly page: number}) =>
					page === 1 ? (
						<>All documents have an assigned patient :)</>
					) : (
						// eslint-disable-next-line react/jsx-no-useless-fragment
						<>{`Nothing to see on page ${page}.`}</>
					)
				}
			/>
		</div>
	);
};

export default UnlinkedDocuments;
