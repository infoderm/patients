import React from 'react';

import {useUnparsedDocuments} from '../../api/issues';

import paged from '../routes/paged';

import makeDocumentsTable from '../documents/makeDocumentsTable';
import DocumentsListAutoFilterToggleButton from '../documents/DocumentsListAutoFilterToggleButton';
import useDocumentsListAutoFilter from '../documents/useDocumentsListAutoFilter';

const DocumentsPage = makeDocumentsTable(useUnparsedDocuments);
const DocumentsPager = paged(DocumentsPage);

type Props = React.JSX.IntrinsicAttributes &
	React.ClassAttributes<HTMLDivElement> &
	React.HTMLAttributes<HTMLDivElement>;

const UnparsedDocuments = (props: Props) => {
	const [filter, toggleFilter] = useDocumentsListAutoFilter();

	return (
		<>
			<div {...props}>
				<DocumentsPager
					filter={filter}
					sort={{
						createdAt: 1,
					}}
				/>
			</div>

			<DocumentsListAutoFilterToggleButton
				filter={filter}
				onClick={toggleFilter}
			/>
		</>
	);
};

export default UnparsedDocuments;
