import React, {type ComponentPropsWithoutRef} from 'react';

import {type DocumentDocument} from '../../api/collection/documents';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import DocumentCard from './DocumentCard';

type Props = {
	readonly loading: boolean;
	readonly documents: DocumentDocument[];
	readonly page: number;
} & ComponentPropsWithoutRef<'div'>;

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
						PatientChip={undefined}
						defaultExpanded={i === 0 && page === 1 && !document.deleted}
					/>
				))}
		</div>
	);
};

export default DocumentsForPatientStatic;
