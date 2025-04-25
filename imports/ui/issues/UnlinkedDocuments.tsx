import React from 'react';

import {useUnlinkedDocuments} from '../../api/issues';

import paged from '../routes/paged';

import makeDocumentsTable from '../documents/makeDocumentsTable';
import DocumentsListAutoFilterToggleButton from '../documents/DocumentsListAutoFilterToggleButton';
import useDocumentsListAutoFilter from '../documents/useDocumentsListAutoFilter';

const DocumentsPage = makeDocumentsTable(useUnlinkedDocuments);
const DocumentsPager = paged(DocumentsPage);

type Props = React.JSX.IntrinsicAttributes &
	React.ClassAttributes<HTMLDivElement> &
	React.HTMLAttributes<HTMLDivElement>;

const UnlinkedDocuments = (props: Props) => {
	const [filter, toggleFilter] = useDocumentsListAutoFilter();

	return (
		<>
			<div {...props}>
				<DocumentsPager
					filter={filter}
					sort={{
						'patient.lastname': 1,
						'patient.firstname': 1,
						datetime: 1,
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

export default UnlinkedDocuments;
