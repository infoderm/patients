import React, {ComponentPropsWithoutRef} from 'react';

import {DocumentDocument} from '../../api/collection/documents';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import DocumentCard from './DocumentCard';

interface Props extends ComponentPropsWithoutRef<'div'> {
	loading: boolean;
	documents: DocumentDocument[];
	page: number;
}

const DocumentsForPatientStatic = ({
	loading,
	documents,
	page,
	...rest
}: Props) => {
	return (
		<div {...rest}>
			{(documents.length === 0 &&
				(loading ? (
					<Loading />
				) : (
					<NoContent>Nothing to see on page {page}.</NoContent>
				))) ||
				documents.map((document, i) => (
					<DocumentCard
						key={document._id}
						document={document}
						PatientChip={null}
						defaultExpanded={i === 0 && page === 1}
					/>
				))}
		</div>
	);
};

export default DocumentsForPatientStatic;
